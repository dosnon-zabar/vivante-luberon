import { equipe } from "@/data/equipe";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function AdminEquipePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brun">Équipe</h1>
          <p className="text-brun-light mt-1">
            Gérer les membres du collectif
          </p>
        </div>
        <button className="px-4 py-2 bg-terracotta text-ivoire font-medium rounded-lg hover:bg-terracotta-dark transition-colors text-sm">
          + Nouveau membre
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipe.map((membre) => (
          <div
            key={membre.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4 p-5">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={membre.photo_url}
                  alt={membre.nom}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover rounded-full"
                  fallbackText={membre.nom.split(" ").map((n) => n[0]).join("")}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg text-brun truncate">
                  {membre.nom}
                </h3>
                <p className="text-sm text-terracotta">{membre.role}</p>
              </div>
            </div>
            <div className="px-5 pb-4">
              <p className="text-sm text-brun-light line-clamp-2">
                {membre.bio}
              </p>
              <div className="flex gap-3 mt-3">
                <button className="text-xs text-terracotta hover:text-terracotta-dark">
                  Modifier
                </button>
                <button className="text-xs text-brun-light hover:text-brun">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
