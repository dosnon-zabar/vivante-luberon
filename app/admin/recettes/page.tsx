import { fetchRecettes } from "@/lib/api";

export default async function AdminRecettesPage() {
  const { recettes } = await fetchRecettes({ limit: 100 });
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brun">Recettes</h1>
          <p className="text-brun-light mt-1">
            Gérer les recettes du collectif
          </p>
        </div>
        <button className="px-4 py-2 bg-terracotta text-ivoire font-medium rounded-lg hover:bg-terracotta-dark transition-colors text-sm">
          + Nouvelle recette
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivoire-dark/50">
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Nom
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Auteur
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Saison
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Statut
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Visibilité
              </th>
              <th className="text-right px-5 py-3 text-brun-light font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recettes.map((r) => (
              <tr
                key={r.id}
                className="border-b border-ivoire-dark/30 last:border-0 hover:bg-ivoire/50"
              >
                <td className="px-5 py-3 text-brun font-medium">{r.nom}</td>
                <td className="px-5 py-3 text-brun-light">{r.auteur.nom}</td>
                <td className="px-5 py-3 text-brun-light capitalize">
                  {r.saison}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      r.statut === "finalisee"
                        ? "bg-sauge/10 text-sauge-dark"
                        : r.statut === "en_cours"
                        ? "bg-ocre/15 text-ocre"
                        : "bg-argile/15 text-argile"
                    }`}
                  >
                    {r.statut.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs ${
                      r.est_publique ? "text-sauge-dark" : "text-brun-light"
                    }`}
                  >
                    {r.est_publique ? "Public" : "Privé"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs text-terracotta hover:text-terracotta-dark mr-3">
                    Modifier
                  </button>
                  <button className="text-xs text-brun-light hover:text-brun">
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
