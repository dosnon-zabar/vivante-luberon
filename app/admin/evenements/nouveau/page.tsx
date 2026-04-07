export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import EventForm from "../EventForm";

function isTraiteur(roles: string[]): boolean {
  return roles.some((r) =>
    ["traiteur", "admin global", "admin_plateforme"].includes(r.toLowerCase())
  );
}

export default async function NouveauEvenementPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!isTraiteur(session.roles)) redirect("/admin");

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/evenements"
        className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-orange transition-colors mb-6"
      >
        &larr; Retour aux événements
      </Link>

      <h1 className="font-serif text-3xl text-brun mb-6">Nouvel événement</h1>

      <EventForm />
    </div>
  );
}
