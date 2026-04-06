import Link from "next/link";
import type { Evenement } from "@/lib/types";
import ImageWithFallback from "./ImageWithFallback";

type Props = {
  evenement: Evenement;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EvenementCard({ evenement }: Props) {
  return (
    <Link
      href={`/evenements/${evenement.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <ImageWithFallback
          src={evenement.photo_url}
          alt={evenement.titre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackText={evenement.titre}
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-orange uppercase tracking-wide">
          {formatDate(evenement.date)}
        </p>
        <h3 className="font-serif text-xl text-brun mt-1 group-hover:text-orange transition-colors">
          {evenement.titre}
        </h3>
        <p className="text-sm text-brun-light mt-2 line-clamp-2">
          {evenement.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-brun-light">{evenement.lieu}</span>
          <span className="text-xs text-vert-eau font-semibold">
            {evenement.inscrits}/{evenement.nombre_places} inscrits
          </span>
        </div>
      </div>
    </Link>
  );
}
