"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import EventDatesEditor from "./EventDatesEditor";
import type { Evenement, EventDate } from "@/lib/types";
import { createEventAction, updateEventAction, type ActionState } from "./actions";

type Props = {
  event?: Evenement;
};

type EditableImage = {
  id?: string;
  type: "cover" | "report";
  url: string;
  caption?: string;
  sort_order?: number;
};

type EditableTestimonial = {
  id?: string;
  auteur: string;
  role?: string;
  texte: string;
  sort_order?: number;
};

type Tab = "general" | "presentation" | "compte-rendu";

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun placeholder:text-brun-light/40 focus:outline-none focus:ring-2 focus:ring-orange/30";

const labelClass = "block text-sm font-medium text-brun mb-1";

export default function EventForm({ event }: Props) {
  const isEdit = !!event;
  const action = isEdit ? updateEventAction : createEventAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  const [tab, setTab] = useState<Tab>("general");
  const [dates, setDates] = useState<EventDate[]>(event?.dates || []);
  const [images, setImages] = useState<EditableImage[]>(event?.images || []);
  const [testimonials, setTestimonials] = useState<EditableTestimonial[]>(
    event?.temoignages || []
  );

  const coverImages = images.filter((i) => i.type === "cover");
  const reportImages = images.filter((i) => i.type === "report");

  function addImage(type: "cover" | "report") {
    setImages([...images, { type, url: "", caption: "", sort_order: images.length }]);
  }

  function updateImage(idx: number, patch: Partial<EditableImage>) {
    setImages(images.map((img, i) => (i === idx ? { ...img, ...patch } : img)));
  }

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function addTestimonial() {
    setTestimonials([
      ...testimonials,
      { auteur: "", texte: "", role: "", sort_order: testimonials.length },
    ]);
  }

  function updateTestimonial(idx: number, patch: Partial<EditableTestimonial>) {
    setTestimonials(testimonials.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  function removeTestimonial(idx: number) {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  }

  // Sérialise les images au format attendu par l'API
  const imagesPayload = images
    .filter((i) => i.url)
    .map((i, idx) => ({
      image_type: i.type,
      image_url: i.url,
      caption: i.caption || null,
      sort_order: idx,
    }));

  const testimonialsPayload = testimonials
    .filter((t) => t.auteur && t.texte)
    .map((t, idx) => ({
      author_name: t.auteur,
      author_role: t.role || null,
      text: t.texte,
      sort_order: idx,
    }));

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="event_id" value={event!.id} />}
      <input type="hidden" name="dates_json" value={JSON.stringify(dates)} />
      <input type="hidden" name="images_json" value={JSON.stringify(imagesPayload)} />
      <input type="hidden" name="testimonials_json" value={JSON.stringify(testimonialsPayload)} />

      {state?.error && (
        <div className="bg-rose/10 text-rose text-sm px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-1 border-b border-brun/10">
        {(
          [
            { key: "general", label: "Infos générales" },
            { key: "presentation", label: "Présentation" },
            { key: "compte-rendu", label: "Compte-rendu" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-[1px] transition-colors ${
              tab === t.key
                ? "border-orange text-orange"
                : "border-transparent text-brun-light hover:text-brun"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* === ONGLET GÉNÉRAL === */}
      {tab === "general" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className={labelClass}>Titre</label>
            <input
              name="name"
              type="text"
              defaultValue={event?.titre || ""}
              required
              className={inputClass}
              placeholder="Nom de l'événement"
            />
          </div>

          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              name="slug"
              type="text"
              defaultValue={event?.slug || ""}
              className={inputClass}
              placeholder="Auto-généré si vide"
            />
            <p className="text-xs text-brun-light/60 mt-1">
              URL : /evenements/<strong>{event?.slug || "..."}</strong>
            </p>
          </div>

          <div>
            <label className={labelClass}>Statut de publication</label>
            <select
              name="status"
              defaultValue={event?.statut || "brouillon"}
              className={inputClass}
            >
              <option value="brouillon">Brouillon</option>
              <option value="non_publiee">Non publié</option>
              <option value="publiee">Publié</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Description courte</label>
            <textarea
              name="description"
              defaultValue={event?.description || ""}
              rows={3}
              className={inputClass}
              placeholder="Quelques lignes résumant l'événement"
            />
          </div>

          <div>
            <label className={labelClass}>Dates de l&apos;événement</label>
            <p className="text-xs text-brun-light/60 mb-3">
              Vous pouvez ajouter plusieurs dates pour les événements récurrents.
            </p>
            <EventDatesEditor initialDates={dates} onChange={setDates} />
          </div>

          <div>
            <label className={labelClass}>Notes internes (optionnel)</label>
            <textarea
              name="notes"
              defaultValue={event?.notes || ""}
              rows={2}
              className={inputClass}
              placeholder="Notes privées, non affichées publiquement"
            />
          </div>
        </div>
      )}

      {/* === ONGLET PRÉSENTATION === */}
      {tab === "presentation" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className={labelClass}>Image de couverture (URL)</label>
            <input
              name="image_url"
              type="text"
              defaultValue={event?.photo_url || ""}
              className={inputClass}
              placeholder="https://traiteur.zabar.fr/api/images/..."
            />
            <p className="text-xs text-brun-light/60 mt-1">
              Image principale affichée en haut de la page événement
            </p>
          </div>

          <div>
            <label className={labelClass}>Texte de présentation</label>
            <textarea
              name="presentation_text"
              defaultValue={event?.presentation || ""}
              rows={8}
              className={inputClass}
              placeholder="Présentation détaillée de l'événement, ce qui y sera fait, l'ambiance..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass + " mb-0"}>Images additionnelles</label>
              <button
                type="button"
                onClick={() => addImage("cover")}
                className="text-xs text-orange hover:text-orange-light font-semibold"
              >
                + Ajouter
              </button>
            </div>
            {coverImages.length === 0 ? (
              <p className="text-xs text-brun-light/60 italic">Aucune image additionnelle</p>
            ) : (
              <div className="space-y-3">
                {coverImages.map((img) => {
                  const idx = images.indexOf(img);
                  return (
                    <div key={idx} className="bg-creme/50 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => updateImage(idx, { url: e.target.value })}
                        className={inputClass}
                        placeholder="URL de l'image"
                      />
                      <input
                        type="text"
                        value={img.caption || ""}
                        onChange={(e) => updateImage(idx, { caption: e.target.value })}
                        className={inputClass}
                        placeholder="Légende (optionnel)"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-xs text-rose hover:text-rose/70"
                      >
                        Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === ONGLET COMPTE-RENDU === */}
      {tab === "compte-rendu" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className={labelClass}>Texte du compte-rendu</label>
            <textarea
              name="report_text"
              defaultValue={event?.compte_rendu || ""}
              rows={10}
              className={inputClass}
              placeholder="Compte-rendu de l'événement après sa tenue"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass + " mb-0"}>Photos du compte-rendu</label>
              <button
                type="button"
                onClick={() => addImage("report")}
                className="text-xs text-orange hover:text-orange-light font-semibold"
              >
                + Ajouter
              </button>
            </div>
            {reportImages.length === 0 ? (
              <p className="text-xs text-brun-light/60 italic">Aucune photo</p>
            ) : (
              <div className="space-y-3">
                {reportImages.map((img) => {
                  const idx = images.indexOf(img);
                  return (
                    <div key={idx} className="bg-creme/50 rounded-lg p-3 space-y-2">
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => updateImage(idx, { url: e.target.value })}
                        className={inputClass}
                        placeholder="URL de l'image"
                      />
                      <input
                        type="text"
                        value={img.caption || ""}
                        onChange={(e) => updateImage(idx, { caption: e.target.value })}
                        className={inputClass}
                        placeholder="Légende (optionnel)"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-xs text-rose hover:text-rose/70"
                      >
                        Supprimer
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass + " mb-0"}>Témoignages</label>
              <button
                type="button"
                onClick={addTestimonial}
                className="text-xs text-orange hover:text-orange-light font-semibold"
              >
                + Ajouter
              </button>
            </div>
            {testimonials.length === 0 ? (
              <p className="text-xs text-brun-light/60 italic">Aucun témoignage</p>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-creme/50 rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={t.auteur}
                        onChange={(e) => updateTestimonial(idx, { auteur: e.target.value })}
                        className={inputClass}
                        placeholder="Nom de l'auteur"
                      />
                      <input
                        type="text"
                        value={t.role || ""}
                        onChange={(e) => updateTestimonial(idx, { role: e.target.value })}
                        className={inputClass}
                        placeholder="Rôle (optionnel)"
                      />
                    </div>
                    <textarea
                      value={t.texte}
                      onChange={(e) => updateTestimonial(idx, { texte: e.target.value })}
                      rows={3}
                      className={inputClass}
                      placeholder="Citation..."
                    />
                    <button
                      type="button"
                      onClick={() => removeTestimonial(idx)}
                      className="text-xs text-rose hover:text-rose/70"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/admin/evenements"
          className="text-sm text-brun-light hover:text-brun"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-orange text-white font-semibold rounded-lg hover:bg-orange-light transition-colors text-sm disabled:opacity-50"
        >
          {pending ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer l'événement"}
        </button>
      </div>
    </form>
  );
}
