"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createTeamMember, updateTeamMember, removeTeamMember } from "@/lib/api";

export async function createMemberAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const data = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
    role_id: (formData.get("role_id") as string) || undefined,
  };

  if (!data.first_name || !data.last_name || !data.email || !data.password) {
    return { error: "Prénom, nom, email et mot de passe sont obligatoires" };
  }

  const result = await createTeamMember(session.token, data);

  if (!result.success) {
    return { error: result.error };
  }

  redirect("/admin/equipe");
}

export async function updateMemberAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const userId = formData.get("user_id") as string;
  const data: Record<string, unknown> = {};

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const roleId = formData.get("role_id") as string;
  const password = formData.get("password") as string;
  const active = formData.get("active");

  if (firstName) data.first_name = firstName;
  if (lastName) data.last_name = lastName;
  if (email) data.email = email;
  if (phone !== null) data.phone = phone || null;
  if (roleId) data.role_id = roleId;
  if (password) data.password = password;
  if (active !== null) data.active = active === "true";

  const result = await updateTeamMember(session.token, userId, data);

  if (!result.success) {
    return { error: result.error };
  }

  redirect("/admin/equipe");
}

export async function removeMemberAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const userId = formData.get("user_id") as string;
  await removeTeamMember(session.token, userId);

  redirect("/admin/equipe");
}
