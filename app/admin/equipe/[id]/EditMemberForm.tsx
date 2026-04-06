"use client";

import { useActionState } from "react";
import { updateMemberAction } from "../actions";
import type { TeamMember, Role } from "@/lib/types";

type Props = {
  member: TeamMember;
  roles: Role[];
};

export default function EditMemberForm({ member, roles }: Props) {
  const [state, formAction, pending] = useActionState(updateMemberAction, null);

  const currentRoleId = member.roles.find((r) =>
    ["contributeur", "traiteur"].includes(r.name)
  )?.id;

  return (
    <form action={formAction} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <input type="hidden" name="user_id" value={member.id} />

      {state?.error && (
        <div className="bg-rose/10 text-rose text-sm px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brun mb-1">Prénom</label>
          <input
            name="first_name"
            defaultValue={member.first_name}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brun mb-1">Nom</label>
          <input
            name="last_name"
            defaultValue={member.last_name}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brun mb-1">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={member.email}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brun mb-1">Téléphone</label>
        <input
          name="phone"
          type="tel"
          defaultValue={member.phone || ""}
          className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brun mb-1">
          Nouveau mot de passe (laisser vide pour ne pas changer)
        </label>
        <input
          name="password"
          type="password"
          minLength={6}
          className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
          placeholder="Minimum 6 caractères"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brun mb-1">Rôle</label>
        <select
          name="role_id"
          defaultValue={currentRoleId || ""}
          className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="hidden"
          name="active"
          value={member.active ? "true" : "false"}
        />
        <label className="flex items-center gap-2 text-sm text-brun cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={member.active}
            onChange={(e) => {
              const hidden = e.target.parentElement?.parentElement?.querySelector(
                'input[name="active"]'
              ) as HTMLInputElement;
              if (hidden) hidden.value = e.target.checked ? "true" : "false";
            }}
            className="rounded border-brun/20 text-orange focus:ring-orange/30"
          />
          Compte actif
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 bg-orange text-white font-semibold rounded-lg hover:bg-orange-light transition-colors text-sm disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
