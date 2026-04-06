import { notFound } from "next/navigation";
import Link from "next/link";
import { evenements } from "@/data/evenements";
import ImageWithFallback from "@/components/ImageWithFallback";
import InscriptionForm from "@/components/InscriptionForm";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return evenements.map((e) => ({ id: e.id }));
}

function formatDateLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EvenementDetailPage({ params }: Props) {
  const { id } = await params;
  const evenement = evenements.find((e) => e.id === id);

  if (!evenement) notFound();

  const placesRestantes = evenement.nombre_places - evenement.inscrits;

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-terracotta transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux événements
        </Link>

        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <ImageWithFallback
            src={evenement.photo_url}
            alt={evenement.titre}
            fill
            className="object-cover"
            fallbackText={evenement.titre}
          />
        </div>

        <p className="text-sm font-medium text-terracotta uppercase tracking-wide">
          {formatDateLong(evenement.date)} &middot; {formatTime(evenement.date)}
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl text-brun mt-2">
          {evenement.titre}
        </h1>

        <div className="flex items-center gap-4 mt-4 text-sm text-brun-light">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            {evenement.lieu}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl text-brun mb-4">Description</h2>
            <div className="bg-white rounded-xl p-6">
              <p className="text-brun-light leading-relaxed">
                {evenement.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            {/* Infos pratiques */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-serif text-lg text-brun mb-3">
                Infos pratiques
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-brun-light">Places totales</span>
                  <span className="text-brun font-medium">
                    {evenement.nombre_places}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-brun-light">Inscrits</span>
                  <span className="text-brun font-medium">
                    {evenement.inscrits}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-brun-light">Places restantes</span>
                  <span
                    className={`font-medium ${
                      placesRestantes > 10
                        ? "text-sauge-dark"
                        : "text-terracotta"
                    }`}
                  >
                    {placesRestantes}
                  </span>
                </li>
              </ul>
            </div>

            {/* Formulaire d'inscription (statique) */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-serif text-lg text-brun mb-3">
                S&apos;inscrire
              </h3>
              <InscriptionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
