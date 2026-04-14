import type { Metadata } from "next";
import { equipe } from "@/data/equipe";
import { fetchSiteConfig } from "@/lib/api";
import ImageWithFallback from "@/components/ImageWithFallback";

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchSiteConfig();
  return {
    title: config?.about_seo_title ?? "À propos",
    description: config?.about_seo_desc ?? undefined,
    openGraph: config?.about_seo_image ? { images: [config.about_seo_image] } : undefined,
  };
}

export default async function AProposPage() {
  const config = await fetchSiteConfig();

  return (
    <div>
      {/* Header image ou titre simple */}
      {config?.about_header_image ? (
        <section
          className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end bg-cover bg-center"
          style={{ backgroundImage: `url(${config.about_header_image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14 w-full">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white mt-2 drop-shadow-lg">
              {config?.about_page_title ?? "À propos"}
            </h1>
          </div>
        </section>
      ) : (
        <div className="pt-12 sm:pt-16" />
      )}

      {/* Histoire et valeurs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 pt-12 sm:pt-16">
        {!config?.about_header_image && (
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-brun">{config?.about_page_title ?? "À propos"}</h1>
        )}
        {config?.about_text ? (
          <div className="rich-content mt-8 space-y-6 text-brun-light leading-relaxed text-lg" style={{ maxWidth: "650px" }}
            dangerouslySetInnerHTML={{ __html: config.about_text }} />
        ) : (
          <div className="mt-8 space-y-6 text-brun-light leading-relaxed text-lg" style={{ maxWidth: "650px" }}>
            <p>
              <strong className="text-brun">Vivante</strong> est né d&apos;une
              envie simple : remettre la cuisine au centre du village. Pas la
              cuisine des magazines, ni celle des restaurants étoilés — la cuisine
              populaire, celle qui se transmet, qui se partage, qui rassemble
              autour d&apos;une table en plein air.
            </p>
          </div>
        )}
      </section>

      {/* Valeurs */}
      {config?.about_values_enabled !== false && (
        <section className="bg-vert-eau-light/30 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-5xl font-bold text-brun text-center mb-12">
              {config?.about_values_title ?? "Nos valeurs"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {(config?.about_values && config.about_values.length > 0
                ? config.about_values
                : [
                    { title: "Territoire", text: "Ancré dans le Luberon, notre travail valorise les producteurs locaux, les savoir-faire paysans et les ressources du territoire." },
                    { title: "Convivialité", text: "La table est un lieu de rencontre. Nos événements sont ouverts à toutes et tous, sans distinction, dans un esprit de partage." },
                    { title: "Transmission", text: "Partager les gestes, les recettes et les histoires. La cuisine est un patrimoine vivant qui se transmet de main en main." },
                  ]
              ).map((val: { title: string; text: string; icon?: string }, i: number) => (
                <div key={i} className="text-center">
                  {val.icon && (
                    <div className="w-16 h-16 mx-auto mb-4">
                      <img src={val.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <h3 className="font-serif text-3xl text-brun mb-2">{val.title}</h3>
                  <p className="text-sm text-brun-light leading-relaxed">{val.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Équipe */}
      {config?.about_team_enabled !== false && (
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-5xl font-bold text-brun text-center mb-12">
              {config?.about_team_title ?? "L'équipe"}
            </h2>
            {(() => {
              const members = config?.about_team_members && config.about_team_members.length > 0
                ? config.about_team_members
                : equipe.map(m => ({ name: m.nom, image_url: m.photo_url, text: m.bio }));
              const cols = members.length === 2 ? "sm:grid-cols-2" : members.length === 1 ? "max-w-md mx-auto" : "sm:grid-cols-2 lg:grid-cols-3";
              return (
            <div className={`grid grid-cols-1 ${cols} gap-8`}>
              {members.map((membre, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  {membre.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={membre.image_url}
                        alt={membre.name}
                        fill
                        className="object-cover"
                        fallbackText={membre.name}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-3xl text-brun">{membre.name}</h3>
                    {(membre as { role?: string }).role && (
                      <p className="text-sm text-terracotta font-medium mt-1">{(membre as { role?: string }).role}</p>
                    )}
                    {membre.text && (
                      <p className="text-sm text-brun-light mt-3 leading-relaxed">{membre.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Contact */}
      {config?.about_contact_enabled !== false && (
        <section className="relative py-20 sm:py-28 bg-stone-50 overflow-hidden">
          <img src="/picto-soleil.png" alt="" className="absolute -bottom-14 -right-14 w-44 sm:w-56 opacity-30 pointer-events-none" />
          <img src="/picto-onde.png" alt="" className="absolute top-12 left-[8%] w-14 sm:w-20 opacity-30 pointer-events-none -rotate-12 hidden sm:block" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-serif text-5xl font-bold text-brun">
              {config?.about_contact_title ?? "Nous contacter"}
            </h2>
            {config?.about_contact_text ? (
              <div className="mt-6 text-lg text-brun-light leading-relaxed max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: config.about_contact_text }} />
            ) : (
              <p className="mt-6 text-lg text-brun-light leading-relaxed max-w-2xl mx-auto">
                Une question, une envie de participer, une idée de collaboration ?
              </p>
            )}
            {(config?.contact_email) && (
              <a
                href={`mailto:${config.contact_email}`}
                className="inline-flex items-center justify-center mt-8 px-7 py-3.5 bg-vert-eau text-white font-semibold rounded-full hover:bg-vert-eau-light transition-colors"
              >
                {config.contact_email}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
