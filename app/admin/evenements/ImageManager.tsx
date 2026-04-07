"use client";

import { useState, useRef, useEffect } from "react";
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
      } catch (e) {
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

  return (
    <div className="space-y-4">
      <ImageDropzone
        prefix="events"
        multiple
        onUploaded={handleUploaded}
        label={label || "Ajouter une ou plusieurs images"}
      />

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              eventId={eventId}
              onDelete={() => handleDelete(img.id)}
              onFieldChange={(field, value) => handleFieldChange(img.id, field, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ImageCardProps = {
  image: ManagedImage;
  eventId: string;
  onDelete: () => void;
  onFieldChange: (field: "caption" | "copyright", value: string) => void;
};

function ImageCard({ image, eventId, onDelete, onFieldChange }: ImageCardProps) {
  const { show } = useToast();
  const [caption, setCaption] = useState(image.caption || "");
  const [copyright, setCopyright] = useState(image.copyright || "");
  const captionTimer = useRef<NodeJS.Timeout | null>(null);
  const copyrightTimer = useRef<NodeJS.Timeout | null>(null);

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
    <div className="bg-creme/50 rounded-lg p-3 flex gap-3">
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-brun/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.image_url}
          alt={image.caption || ""}
          className="w-full h-full object-cover"
        />
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
