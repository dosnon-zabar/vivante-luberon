import { evenements } from "@/data/evenements";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminEvenementsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brun">Événements</h1>
          <p className="text-brun-light mt-1">
            Gérer les événements du collectif
          </p>
        </div>
        <button className="px-4 py-2 bg-terracotta text-ivoire font-medium rounded-lg hover:bg-terracotta-dark transition-colors text-sm">
          + Nouvel événement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivoire-dark/50">
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Titre
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Date
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Lieu
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Inscrits
              </th>
              <th className="text-left px-5 py-3 text-brun-light font-medium">
                Statut
              </th>
              <th className="text-right px-5 py-3 text-brun-light font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((e) => (
              <tr
                key={e.id}
                className="border-b border-ivoire-dark/30 last:border-0 hover:bg-ivoire/50"
              >
                <td className="px-5 py-3 text-brun font-medium">{e.titre}</td>
                <td className="px-5 py-3 text-brun-light">
                  {formatDate(e.date)}
                </td>
                <td className="px-5 py-3 text-brun-light">{e.lieu}</td>
                <td className="px-5 py-3 text-brun-light">
                  {e.inscrits}/{e.nombre_places}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      e.statut === "a_venir"
                        ? "bg-sauge/10 text-sauge-dark"
                        : e.statut === "en_cours"
                        ? "bg-ocre/15 text-ocre"
                        : "bg-argile/15 text-argile"
                    }`}
                  >
                    {e.statut.replace("_", " ")}
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
