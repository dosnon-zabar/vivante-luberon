import Link from "next/link";
import { fetchRecettes } from "@/lib/api";
import { evenements } from "@/data/evenements";
import { equipe } from "@/data/equipe";

export default async function AdminDashboard() {
  const { recettes, total } = await fetchRecettes({ limit: 50 });

  const stats = [
    {
      label: "Recettes",
      value: total,
      href: "/admin/recettes",
      color: "bg-sauge/15 text-sauge-dark",
    },
    {
      label: "Événements",
      value: evenements.length,
      href: "/admin/evenements",
      color: "bg-ocre/15 text-ocre",
    },
    {
      label: "Membres",
      value: equipe.length,
      href: "/admin/equipe",
      color: "bg-terracotta/15 text-terracotta",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-brun mb-2">Dashboard</h1>
      <p className="text-brun-light mb-8">
        Vue d&apos;ensemble de la plateforme Vivante.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-brun-light">{stat.label}</p>
            <p className={`text-4xl font-serif font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-brun mb-4">
            Dernières recettes
          </h2>
          <ul className="space-y-3">
            {recettes.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between text-sm border-b border-ivoire-dark/50 pb-2 last:border-0"
              >
                <span className="text-brun">{r.nom}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.est_publique
                      ? "bg-sauge/10 text-sauge-dark"
                      : "bg-argile/15 text-argile"
                  }`}
                >
                  {r.est_publique ? "Public" : "Brouillon"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-brun mb-4">
            Prochains événements
          </h2>
          <ul className="space-y-3">
            {evenements.slice(0, 5).map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between text-sm border-b border-ivoire-dark/50 pb-2 last:border-0"
              >
                <span className="text-brun">{e.titre}</span>
                <span className="text-xs text-brun-light">
                  {e.inscrits}/{e.nombre_places}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
