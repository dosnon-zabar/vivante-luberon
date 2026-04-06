export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchRecettes, fetchEvenements, fetchTeamMembers } from "@/lib/api";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ recettes, total: totalRecettes }, { evenements, total: totalEvenements }, members] =
    await Promise.all([
      fetchRecettes({ limit: 5 }),
      fetchEvenements({ limit: 5, sort_by: "event_date", sort_order: "asc" }),
      fetchTeamMembers(session.token),
    ]);

  const stats = [
    {
      label: "Recettes",
      value: totalRecettes,
      href: "/admin/recettes",
      color: "bg-vert-eau/15 text-vert-eau",
    },
    {
      label: "Événements",
      value: totalEvenements,
      href: "/admin/evenements",
      color: "bg-orange/10 text-orange",
    },
    {
      label: "Membres",
      value: members.length,
      href: "/admin/equipe",
      color: "bg-jaune/15 text-jaune",
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
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-brun-light">{stat.label}</p>
            <p className={`text-4xl font-serif font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-brun mb-4">
            Dernières recettes
          </h2>
          <ul className="space-y-3">
            {recettes.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between text-sm border-b border-creme-dark/50 pb-2 last:border-0"
              >
                <span className="text-brun">{r.nom}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.statut === "finalisee"
                      ? "bg-vert-eau/15 text-vert-eau"
                      : "bg-orange/10 text-orange"
                  }`}
                >
                  {r.statut.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-xl text-brun mb-4">
            Événements
          </h2>
          {evenements.length > 0 ? (
            <ul className="space-y-3">
              {evenements.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between text-sm border-b border-creme-dark/50 pb-2 last:border-0"
                >
                  <span className="text-brun">{e.titre}</span>
                  <span className="text-xs text-brun-light">
                    {e.date ? new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brun-light/60">Aucun événement</p>
          )}
        </div>
      </div>
    </div>
  );
}
