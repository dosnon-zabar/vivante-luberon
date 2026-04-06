export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { fetchTeamMembers, fetchRoles } from "@/lib/api";
import EditMemberForm from "./EditMemberForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMembrePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const [members, roles] = await Promise.all([
    fetchTeamMembers(session.token),
    fetchRoles(session.token),
  ]);

  const member = members.find((m) => m.id === id);
  if (!member) redirect("/admin/equipe");

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/equipe"
        className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-orange transition-colors mb-6"
      >
        &larr; Retour à l&apos;équipe
      </Link>

      <h1 className="font-serif text-3xl text-brun mb-6">
        Modifier {member.first_name} {member.last_name}
      </h1>

      <EditMemberForm member={member} roles={roles} />
    </div>
  );
}
