import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchEvenement } from "@/lib/api";
import ImageWithFallback from "@/components/ImageWithFallback";
import InscriptionForm from "@/components/InscriptionForm";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDateLong(dateStr: string | null) {
  if (!dateStr) return "Date à confirmer";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function EvenementDetailPage({ params }: Props) {
  const { id } = await params;
  const evenement = await fetchEvenement(id);

  if (!evenement) notFound();

  const coverImages = evenement.images.filter((img) => img.type === "cover");
  const reportImages = evenement.images.filter((img) => img.type === "report");

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-orange transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux événements
        </Link>

        {/* Image de couverture */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <ImageWithFallback
            src={evenement.photo_url || coverImages[0]?.url}
            alt={evenement.titre}
            fill
            className="object-cover"
            fallbackText={evenement.titre}
          />
          {evenement.est_passe && (
            <div className="absolute top-4 left-4 bg-brun/80 text-white text-xs font-medium px-3 py-1 rounded-full">
              Événement passé
            </div>
          )}
        </div>

        <p className="text-sm font-semibold text-orange uppercase tracking-wide">
          {formatDateLong(evenement.date)}
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl text-brun mt-2">
          {evenement.titre}
        </h1>

        {evenement.nombre_places > 0 && (
          <p className="text-sm text-brun-light mt-3">
            {evenement.nombre_places} places
          </p>
        )}

        {/* Contenu conditionnel */}
        {evenement.est_passe ? (
          /* === ÉVÉNEMENT PASSÉ === */
          <div className="mt-10 space-y-10">
            {/* Compte-rendu */}
            {evenement.compte_rendu && (
              <section>
                <h2 className="font-serif text-2xl text-brun mb-4">Compte-rendu</h2>
                <div className="bg-white rounded-xl p-6">
                  <p className="text-brun-light leading-relaxed whitespace-pre-line">
                    {stripHtml(evenement.compte_rendu)}
                  </p>
                </div>
              </section>
            )}

            {/* Galerie photos report */}
            {reportImages.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-brun mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {reportImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={img.url}
                        alt={img.caption || `Photo ${i + 1}`}
                        fill
                        className="object-cover"
                        fallbackText={img.caption || `Photo ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Témoignages */}
            {evenement.temoignages.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl text-brun mb-4">Témoignages</h2>
                <div className="space-y-4">
                  {evenement.temoignages.map((t, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border-l-4 border-orange/30">
                      <p className="text-brun-light leading-relaxed italic">
                        &ldquo;{t.texte}&rdquo;
                      </p>
                      <p className="mt-3 text-sm text-brun font-medium">
                        {t.auteur}
                        {t.role && (
                          <span className="text-brun-light font-normal"> — {t.role}</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description si pas de compte-rendu */}
            {!evenement.compte_rendu && evenement.description && (
              <section>
                <h2 className="font-serif text-2xl text-brun mb-4">Description</h2>
                <div className="bg-white rounded-xl p-6">
                  <p className="text-brun-light leading-relaxed">
                    {evenement.description}
                  </p>
                </div>
              </section>
            )}
          </div>
        ) : (
          /* === ÉVÉNEMENT À VENIR === */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="md:col-span-2 space-y-8">
              {/* Présentation */}
              {evenement.presentation && (
                <section>
                  <h2 className="font-serif text-2xl text-brun mb-4">Présentation</h2>
                  <div className="bg-white rounded-xl p-6">
                    <p className="text-brun-light leading-relaxed whitespace-pre-line">
                      {stripHtml(evenement.presentation)}
                    </p>
                  </div>
                </section>
              )}

              {/* Description */}
              {evenement.description && (
                <section>
                  <h2 className="font-serif text-2xl text-brun mb-4">Description</h2>
                  <div className="bg-white rounded-xl p-6">
                    <p className="text-brun-light leading-relaxed">
                      {evenement.description}
                    </p>
                  </div>
                </section>
              )}

              {/* Galerie cover */}
              {coverImages.length > 1 && (
                <section>
                  <div className="grid grid-cols-2 gap-3">
                    {coverImages.slice(1).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <ImageWithFallback
                          src={img.url}
                          alt={img.caption || `Photo ${i + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="md:col-span-1 space-y-6">
              {/* Infos pratiques */}
              <div className="bg-white rounded-xl p-5">
                <h3 className="font-serif text-lg text-brun mb-3">
                  Infos pratiques
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-brun-light">Date</span>
                    <span className="text-brun font-medium">
                      {formatDateLong(evenement.date)}
                    </span>
                  </li>
                  {evenement.nombre_places > 0 && (
                    <li className="flex justify-between">
                      <span className="text-brun-light">Places</span>
                      <span className="text-brun font-medium">
                        {evenement.nombre_places}
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Formulaire d'inscription */}
              <div className="bg-white rounded-xl p-5">
                <h3 className="font-serif text-lg text-brun mb-3">
                  S&apos;inscrire
                </h3>
                <InscriptionForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
