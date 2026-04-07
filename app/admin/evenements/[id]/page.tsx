export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchEvenement } from "@/lib/api";
import EventForm from "../EventForm";

function isTraiteur(roles: string[]): boolean {
  return roles.some((r) =>
    ["traiteur", "admin global", "admin_plateforme"].includes(r.toLowerCase())
  );
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEvenementPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!isTraiteur(session.roles)) redirect("/admin");

  const { id } = await params;
  const evenement = await fetchEvenement(id, { token: session.token, cache: "no-store" });

  if (!evenement) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/evenements"
        className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-orange transition-colors mb-6"
      >
        &larr; Retour aux événements
      </Link>

      <h1 className="font-serif text-3xl text-brun mb-6">
        Modifier {evenement.titre}
      </h1>

      <EventForm event={evenement} />
    </div>
  );
}
