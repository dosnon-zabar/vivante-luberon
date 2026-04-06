import { evenements } from "@/data/evenements";
import EvenementCard from "@/components/EvenementCard";

const evenementsAVenir = evenements
  .filter((e) => e.statut === "a_venir")
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export default function EvenementsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl text-brun">
            Événements
          </h1>
          <p className="mt-3 text-lg text-brun-light">
            Banquets, ateliers, marchés et rencontres — retrouvez-nous sur le
            terrain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evenementsAVenir.map((evt) => (
            <EvenementCard key={evt.id} evenement={evt} />
          ))}
        </div>
      </div>
    </div>
  );
}
