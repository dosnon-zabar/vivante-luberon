import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchRecette } from "@/lib/api";
import ImageWithFallback from "@/components/ImageWithFallback";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecetteDetailPage({ params }: Props) {
  const { id } = await params;
  const recette = await fetchRecette(id);

  if (!recette) notFound();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/recettes"
          className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-terracotta transition-colors mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour aux recettes
        </Link>

        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <ImageWithFallback
            src={recette.photo_url}
            alt={recette.nom}
            fill
            className="object-cover"
            fallbackText={recette.nom}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recette.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-sauge/10 text-sauge-dark"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs px-3 py-1 rounded-full bg-ocre/15 text-ocre">
            {recette.saison}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-brun">
          {recette.nom}
        </h1>

        <div className="flex items-center gap-4 mt-4 text-sm text-brun-light">
          <span>Par {recette.auteur.nom}</span>
          <span>&middot;</span>
          <span>{recette.nombre_parts} parts</span>
          <span>&middot;</span>
          <span className="capitalize">{recette.statut.replace("_", " ")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {/* Ingrédients */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl text-brun mb-4">Ingrédients</h2>
            <div className="bg-white rounded-xl p-5">
              {recette.ingredients.length > 0 ? (
                <ul className="space-y-3">
                  {recette.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex justify-between text-sm border-b border-ivoire-dark/50 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-brun">{ing.nom}</span>
                      <span className="text-brun-light whitespace-nowrap ml-4">
                        {ing.quantite} {ing.unite}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-brun-light/60 italic">
                  Pas d&apos;ingrédients renseignés
                </p>
              )}
            </div>
          </div>

          {/* Préparation */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl text-brun mb-4">Préparation</h2>
            {recette.etapes.length > 0 ? (
              <div className="space-y-6">
                {recette.etapes.map((etape, i) => (
                  <div key={i} className="bg-white rounded-xl p-6">
                    <p className="text-xs font-medium text-terracotta uppercase tracking-wide mb-2">
                      Étape {i + 1}
                    </p>
                    <p className="text-brun-light leading-relaxed whitespace-pre-line">
                      {etape.texte}
                    </p>
                    {etape.image_url && (
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mt-4">
                        <ImageWithFallback
                          src={etape.image_url}
                          alt={`Étape ${i + 1}`}
                          fill
                          className="object-cover"
                          fallbackText={`Étape ${i + 1}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : recette.instructions ? (
              <div className="bg-white rounded-xl p-6">
                <p className="text-brun-light leading-relaxed whitespace-pre-line">
                  {recette.instructions}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6">
                <p className="text-sm text-brun-light/60 italic">
                  Pas d&apos;instructions renseignées
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
