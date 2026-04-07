"use client";

import { deleteEventAction } from "./actions";

export default function RemoveEventButton({ eventId, title }: { eventId: string; title: string }) {
  return (
    <form action={deleteEventAction} className="inline">
      <input type="hidden" name="event_id" value={eventId} />
      <button
        type="submit"
        className="text-xs text-brun-light hover:text-rose"
        onClick={(e) => {
          if (!confirm(`Supprimer définitivement l'événement "${title}" ?`)) {
            e.preventDefault();
          }
        }}
      >
        Supprimer
      </button>
    </form>
  );
}
