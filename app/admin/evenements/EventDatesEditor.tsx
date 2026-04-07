"use client";

import { useState } from "react";
import type { EventDate } from "@/lib/types";

type Props = {
  initialDates: EventDate[];
  onChange: (dates: EventDate[]) => void;
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30";

function toLocalDatetime(iso: string): string {
  // Convertir un ISO datetime en format compatible <input type="datetime-local"> (sans Z)
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDatetime(local: string): string {
  // Inverse : datetime-local → ISO
  return new Date(local).toISOString();
}

export default function EventDatesEditor({ initialDates, onChange }: Props) {
  const [dates, setDates] = useState<EventDate[]>(() =>
    initialDates.length > 0
      ? initialDates
      : [
          {
            start_datetime: new Date().toISOString(),
            duration_minutes: null,
            guest_count: 0,
            location: null,
            reservation_open: false,
            reservation_url: null,
            sort_order: 0,
          },
        ]
  );

  function update(idx: number, patch: Partial<EventDate>) {
    const newDates = dates.map((d, i) => (i === idx ? { ...d, ...patch } : d));
    setDates(newDates);
    onChange(newDates);
  }

  function addDate() {
    const newDate: EventDate = {
      start_datetime: new Date().toISOString(),
      duration_minutes: null,
      guest_count: 0,
      location: null,
      reservation_open: false,
      reservation_url: null,
      sort_order: dates.length,
    };
    const newDates = [...dates, newDate];
    setDates(newDates);
    onChange(newDates);
  }

  function removeDate(idx: number) {
    const newDates = dates
      .filter((_, i) => i !== idx)
      .map((d, i) => ({ ...d, sort_order: i }));
    setDates(newDates);
    onChange(newDates);
  }

  return (
    <div className="space-y-4">
      {dates.map((d, idx) => (
        <div key={idx} className="bg-creme/50 rounded-lg p-4 space-y-3 border border-brun/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brun-light uppercase tracking-wide">
              Date {idx + 1}
            </span>
            {dates.length > 1 && (
              <button
                type="button"
                onClick={() => removeDate(idx)}
                className="text-xs text-rose hover:text-rose/70"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-brun-light mb-1">Date et heure</label>
              <input
                type="datetime-local"
                value={toLocalDatetime(d.start_datetime)}
                onChange={(e) => update(idx, { start_datetime: fromLocalDatetime(e.target.value) })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-brun-light mb-1">Durée (minutes)</label>
              <input
                type="number"
                min="0"
                value={d.duration_minutes ?? ""}
                onChange={(e) =>
                  update(idx, {
                    duration_minutes: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className={inputClass}
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label className="block text-xs text-brun-light mb-1">Lieu</label>
              <input
                type="text"
                value={d.location || ""}
                onChange={(e) => update(idx, { location: e.target.value || null })}
                className={inputClass}
                placeholder="Adresse, ville..."
              />
            </div>
            <div>
              <label className="block text-xs text-brun-light mb-1">Places</label>
              <input
                type="number"
                min="0"
                value={d.guest_count}
                onChange={(e) => update(idx, { guest_count: parseInt(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-brun cursor-pointer">
              <input
                type="checkbox"
                checked={d.reservation_open}
                onChange={(e) => update(idx, { reservation_open: e.target.checked })}
                className="rounded border-brun/20 text-orange focus:ring-orange/30"
              />
              Réservation ouverte
            </label>
            {d.reservation_open && (
              <input
                type="url"
                value={d.reservation_url || ""}
                onChange={(e) => update(idx, { reservation_url: e.target.value || null })}
                className={inputClass}
                placeholder="https://..."
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDate}
        className="w-full py-2 border-2 border-dashed border-brun/20 rounded-lg text-sm text-brun-light hover:bg-creme/50 hover:border-orange/30 hover:text-orange transition-colors"
      >
        + Ajouter une date
      </button>
    </div>
  );
}
