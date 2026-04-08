"use client";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageDropzone from "@/components/ImageDropzone";
import { useToast } from "@/components/ToastProvider";

export type ManagedImage = {
  id: string;
  image_url: string;
  caption: string | null;
  copyright: string | null;
  sort_order: number;
};

type Props = {
  eventId: string;
  imageType: "cover" | "report";
  initialImages: ManagedImage[];
  label?: string;
};

export default function ImageManager({
  eventId,
  imageType,
  initialImages,
  label,
}: Props) {
  const [images, setImages] = useState<ManagedImage[]>(initialImages);
  const { show } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleUploaded(urls: string[]) {
    for (const url of urls) {
      try {
        const res = await fetch(`/api/events/${eventId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_type: imageType,
            image_url: url,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          show(json.error || "Erreur lors de l'ajout de l'image", "error");
          continue;
        }
        setImages((prev) => [...prev, json.image]);
        show("Image ajoutée et liée à l'événement", "success");
      } catch {
        show("Erreur réseau lors de l'ajout", "error");
      }
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm("Supprimer définitivement cette image ?")) return;
    try {
      const res = await fetch(`/api/events/${eventId}/images/${imageId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        show(json.error || "Erreur lors de la suppression", "error");
        return;
      }
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      show("Image supprimée", "success");
    } catch {
      show("Erreur réseau lors de la suppression", "error");
    }
  }

  function handleFieldChange(
    imageId: string,
    field: "caption" | "copyright",
    value: string
  ) {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, [field]: value } : img))
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
      ...img,
      sort_order: idx,
    }));
    setImages(reordered);

    // Persist new sort_order for every image whose position changed
    try {
      await Promise.all(
        reordered.map((img) =>
          fetch(`/api/events/${eventId}/images/${img.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sort_order: img.sort_order }),
          })
        )
      );
      show("Ordre mis à jour", "success");
    } catch {
      show("Erreur lors de la mise à jour de l'ordre", "error");
    }
  }

  return (
    <div className="space-y-4">
      <ImageDropzone
        prefix="events"
        multiple
        onUploaded={handleUploaded}
        label={label || "Ajouter une ou plusieurs images"}
      />

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {images.map((img, idx) => (
                <SortableImageCard
                  key={img.id}
                  image={img}
                  eventId={eventId}
                  isCover={imageType === "cover" && idx === 0}
                  draggable={images.length > 1}
                  onDelete={() => handleDelete(img.id)}
                  onFieldChange={(field, value) => handleFieldChange(img.id, field, value)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

type ImageCardProps = {
  image: ManagedImage;
  eventId: string;
  isCover: boolean;
  draggable: boolean;
  onDelete: () => void;
  onFieldChange: (field: "caption" | "copyright", value: string) => void;
};

function SortableImageCard({
  image,
  eventId,
  isCover,
  draggable,
  onDelete,
  onFieldChange,
}: ImageCardProps) {
  const { show } = useToast();
  const [caption, setCaption] = useState(image.caption || "");
  const [copyright, setCopyright] = useState(image.copyright || "");
  const captionTimer = useRef<NodeJS.Timeout | null>(null);
  const copyrightTimer = useRef<NodeJS.Timeout | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Sync depuis prop si l'image est rechargée depuis l'extérieur
  useEffect(() => {
    setCaption(image.caption || "");
    setCopyright(image.copyright || "");
  }, [image.id, image.caption, image.copyright]);

  async function patchField(field: "caption" | "copyright", value: string) {
    try {
      const res = await fetch(`/api/events/${eventId}/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        show(json.error || "Erreur sauvegarde", "error");
      } else {
        onFieldChange(field, value);
      }
    } catch {
      show("Erreur réseau", "error");
    }
  }

  function handleCaptionChange(value: string) {
    setCaption(value);
    if (captionTimer.current) clearTimeout(captionTimer.current);
    captionTimer.current = setTimeout(() => patchField("caption", value), 800);
  }

  function handleCopyrightChange(value: string) {
    setCopyright(value);
    if (copyrightTimer.current) clearTimeout(copyrightTimer.current);
    copyrightTimer.current = setTimeout(() => patchField("copyright", value), 800);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-creme/50 rounded-lg p-3 flex gap-3 items-start"
    >
      {draggable && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="self-stretch flex items-center px-1 text-brun-light/40 hover:text-brun cursor-grab active:cursor-grabbing touch-none"
          aria-label="Glisser pour réorganiser"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-brun/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.image_url}
          alt={image.caption || ""}
          className="w-full h-full object-cover"
        />
        {isCover && (
          <span className="absolute top-1 left-1 bg-orange text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            Couverture
          </span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => handleCaptionChange(e.target.value)}
          placeholder="Légende"
          className="w-full px-3 py-2 rounded-lg border border-brun/10 bg-white text-sm text-brun placeholder:text-brun-light/40 focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
        <input
          type="text"
          value={copyright}
          onChange={(e) => handleCopyrightChange(e.target.value)}
          placeholder="Copyright (ex: © Photo Dupont)"
          className="w-full px-3 py-2 rounded-lg border border-brun/10 bg-white text-sm text-brun placeholder:text-brun-light/40 focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-rose hover:text-rose/70 self-start px-2 py-1"
        aria-label="Supprimer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
