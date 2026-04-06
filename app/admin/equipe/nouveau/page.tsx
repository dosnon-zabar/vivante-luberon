"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createMemberAction } from "../actions";

type Role = { id: string; name: string };

export default function NouveauMembrePage() {
  const [state, formAction, pending] = useActionState(createMemberAction, null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((data) => setRoles(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/equipe"
        className="inline-flex items-center gap-1 text-sm text-brun-light hover:text-orange transition-colors mb-6"
      >
        &larr; Retour à l&apos;équipe
      </Link>

      <h1 className="font-serif text-3xl text-brun mb-6">Nouveau membre</h1>

      <form action={formAction} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        {state?.error && (
          <div className="bg-rose/10 text-rose text-sm px-4 py-3 rounded-lg">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brun mb-1">Prénom</label>
            <input name="first_name" required className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brun mb-1">Nom</label>
            <input name="last_name" required className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brun mb-1">Email</label>
          <input name="email" type="email" required className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brun mb-1">Téléphone (optionnel)</label>
          <input name="phone" type="tel" className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brun mb-1">Mot de passe</label>
          <input name="password" type="password" required minLength={6} className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30" placeholder="Minimum 6 caractères" />
        </div>

        <div>
          <label className="block text-sm font-medium text-brun mb-1">Rôle</label>
          <select name="role_id" className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun focus:outline-none focus:ring-2 focus:ring-orange/30">
            <option value="">Contributeur (par défaut)</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 bg-orange text-white font-semibold rounded-lg hover:bg-orange-light transition-colors text-sm disabled:opacity-50"
        >
          {pending ? "Création..." : "Créer le membre"}
        </button>
      </form>
    </div>
  );
}
