"use client"

/**
 * ShoppingListModal — popin "Liste de courses" sur la fiche recette.
 *
 * Déclenchée par ShoppingListButton sous la liste d'ingrédients.
 * L'utilisateur ajuste le nombre de parts (±) et voit la liste se
 * recalculer en direct, groupée par rayon de supermarché dans l'ordre
 * défini par l'admin (sort_order par parent + par enfant).
 *
 * Trois règles métier clés :
 *
 *  - **Fallback du rayon** : si `recipe_ingredients.aisle_id` est null,
 *    on utilise `master.default_aisle` (géré en amont dans mapRecipe).
 *    Un ingrédient ne tombe en "Autres" QUE si ni l'un ni l'autre ne
 *    sont renseignés.
 *
 *  - **Ordre des rayons** : on trie par (parent.sort_order,
 *    own.sort_order, own.nom). Pour un rayon sans parent, on utilise
 *    (own.sort_order, 0, own.nom). "Autres" (aucun rayon) toujours
 *    en dernier. Le parent n'est pas affiché — c'est juste un axe
 *    de tri, la section reste le rayon-feuille.
 *
 *  - **Regroupement de doublons** : deux entrées avec le même nom
 *    (lowercase + trim) ET la même unité sont fusionnées, les
 *    quantités additionnées. Les commentaires distincts sont
 *    concaténés ; les commentaires identiques dédupliqués.
 */

import { useState, useEffect, useMemo } from "react"
import { formatIngredientNatural } from "@/lib/format-ingredient"
import type { Recette, Aisle } from "@/lib/types"

interface Props {
  open: boolean
  onClose: () => void
  recette: Recette
  /** Référentiel complet des rayons (fetch séparé via fetchAisles). */
  aisles: Aisle[]
}

/** Max 2 décimales, pareil que manager/RecipePdfModal.tsx. */
function roundQty(qty: number): number {
  if (qty === Math.floor(qty)) return qty
  return Math.round(qty * 100) / 100
}

/** Clé de merge : nom normalisé + unité. */
function mergeKey(nom: string, unite: string): string {
  return `${nom.trim().toLowerCase()}|${unite.trim().toLowerCase()}`
}

export default function ShoppingListModal({ open, onClose, recette, aisles }: Props) {
  const [portions, setPortions] = useState(recette.nombre_parts || 1)

  useEffect(() => {
    if (open) setPortions(recette.nombre_parts || 1)
  }, [open, recette.nombre_parts])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const portionLabel = recette.portion_type || "personnes"
  const multiplier = portions / (recette.nombre_parts || 1)

  /** Map aisle id → aisle row (pour lookup parent). */
  const aislesById = useMemo(() => {
    const m = new Map<string, Aisle>()
    for (const a of aisles) m.set(a.id, a)
    return m
  }, [aisles])

  /**
   * Résultat : tableau de sections, chaque section = un rayon-feuille
   * (ou "Autres"), avec ses ingrédients déjà fusionnés. Sections triées
   * dans l'ordre de course : parent.sort_order → own.sort_order → nom.
   */
  const grouped = useMemo(() => {
    type Merged = {
      nom: string
      nom_pluriel?: string | null
      unite: string
      unite_pluriel?: string | null
      scaledQty: number
      comments: string[]
      rayonId: string | null
    }

    // 1. Merge par (nom + unité) pour fusionner les doublons.
    const mergedMap = new Map<string, Merged>()
    for (const ing of recette.ingredients) {
      const name = ing.nom.trim()
      if (!name) continue
      const scaled = ing.quantite ? roundQty(ing.quantite * multiplier) : 0
      const key = mergeKey(name, ing.unite || "")
      const existing = mergedMap.get(key)
      if (existing) {
        existing.scaledQty = roundQty(existing.scaledQty + scaled)
        if (ing.commentaire && !existing.comments.includes(ing.commentaire)) {
          existing.comments.push(ing.commentaire)
        }
        // Preserve the first non-null rayon (they should match in
        // practice ; if they don't, first-seen wins).
        if (!existing.rayonId && ing.rayon?.id) {
          existing.rayonId = ing.rayon.id
        }
      } else {
        mergedMap.set(key, {
          nom: name,
          nom_pluriel: ing.nom_pluriel ?? null,
          unite: ing.unite,
          unite_pluriel: ing.unite_pluriel ?? null,
          scaledQty: scaled,
          comments: ing.commentaire ? [ing.commentaire] : [],
          rayonId: ing.rayon?.id ?? null,
        })
      }
    }

    // 2. Group by rayon id (leaf).
    const byRayon = new Map<
      string,
      { rayon: Aisle | null; items: Merged[] }
    >()
    for (const m of mergedMap.values()) {
      const rayon = m.rayonId ? aislesById.get(m.rayonId) ?? null : null
      const key = rayon?.id ?? "__autres__"
      const bucket = byRayon.get(key) ?? { rayon, items: [] }
      bucket.items.push(m)
      byRayon.set(key, bucket)
    }

    // 3. Sort key for each rayon: (parent.sort_order, own.sort_order, own.name).
    //    Rayons without parent use their own sort_order as the "parent" slot
    //    so top-level aisles can interleave naturally with children of other
    //    parents. "Autres" always last.
    function sortKey(rayon: Aisle | null): [number, number, string] {
      if (!rayon) return [Number.MAX_SAFE_INTEGER, 0, ""]
      const parent = rayon.parent_id ? aislesById.get(rayon.parent_id) : null
      const parentSort = parent
        ? parent.sort_order ?? 0
        : rayon.sort_order ?? 0
      const ownSort = parent ? rayon.sort_order ?? 0 : 0
      return [parentSort, ownSort, rayon.name]
    }

    return [...byRayon.values()].sort((a, b) => {
      const ka = sortKey(a.rayon)
      const kb = sortKey(b.rayon)
      if (ka[0] !== kb[0]) return ka[0] - kb[0]
      if (ka[1] !== kb[1]) return ka[1] - kb[1]
      return ka[2].localeCompare(kb[2], "fr")
    })
  }, [recette.ingredients, aislesById, multiplier])

  // État du formulaire d'envoi email — inline dans la modal (pas de
  // sous-popin). Se révèle au clic sur "Envoyer par email".
  const [emailMode, setEmailMode] = useState<"idle" | "form" | "sending" | "sent" | "error">("idle")
  const [emailTo, setEmailTo] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setEmailMode("idle")
      setEmailTo("")
      setEmailError(null)
    }
  }, [open])

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    setEmailError(null)
    const to = emailTo.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setEmailError("Adresse email invalide.")
      return
    }

    setEmailMode("sending")

    // Sérialise les sections déjà formatées (on réutilise le même rendu
    // que le DOM — cohérence côté email garantie).
    const sections = grouped.map((g) => ({
      rayon: g.rayon?.name ?? "Autres",
      color: g.rayon?.color ?? null,
      items: g.items.map((ing) => ({
        line:
          ing.scaledQty > 0
            ? formatIngredientNatural(
                ing.nom,
                ing.scaledQty,
                ing.unite,
                ing.unite_pluriel,
                ing.nom_pluriel,
              )
            : ing.nom,
        note: ing.comments.length > 0 ? ing.comments.join(" ; ") : null,
      })),
    }))

    try {
      const res = await fetch("/api/shopping-list/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: to,
          recipe_name: recette.nom,
          recipe_url:
            typeof window !== "undefined" ? window.location.href : "",
          portions,
          portion_label: portionLabel,
          groups: sections,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        setEmailError(data.error || "Envoi échoué, réessaye plus tard.")
        setEmailMode("error")
        return
      }
      setEmailMode("sent")
    } catch {
      setEmailError("Erreur réseau")
      setEmailMode("error")
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-list-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1
              id="shopping-list-title"
              className="font-serif text-3xl text-brun leading-tight"
            >
              Liste de courses
            </h1>
            <h2 className="font-serif text-xl text-brun-light mt-1">
              {recette.nom}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-brun-light hover:text-brun text-lg leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="bg-creme rounded-lg p-4 mb-5">
          <label className="block text-sm font-medium text-brun mb-2">
            Recette pour {recette.nombre_parts} {portionLabel} — adapter
            pour
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPortions((p) => Math.max(1, p - 1))}
              aria-label="Diminuer"
              className="w-9 h-9 rounded-full bg-white border border-brun/10 text-brun flex items-center justify-center hover:bg-creme-dark transition-colors text-lg"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={portions}
              onChange={(e) =>
                setPortions(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center text-lg font-semibold text-brun bg-white border border-brun/10 rounded-lg px-2 py-1"
            />
            <button
              type="button"
              onClick={() => setPortions((p) => p + 1)}
              aria-label="Augmenter"
              className="w-9 h-9 rounded-full bg-white border border-brun/10 text-brun flex items-center justify-center hover:bg-creme-dark transition-colors text-lg"
            >
              +
            </button>
            <span className="text-sm text-brun-light">{portionLabel}</span>
            {multiplier !== 1 && (
              <span className="text-xs text-terracotta ml-auto font-medium">
                ×{roundQty(multiplier)}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {grouped.length === 0 ? (
            <p className="text-sm text-brun-light italic">
              Pas d&apos;ingrédients dans cette recette.
            </p>
          ) : (
            grouped.map((g) => (
              <section key={g.rayon?.id ?? "__autres__"}>
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brun-light mb-2">
                  {g.rayon?.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: g.rayon.color }}
                      aria-hidden
                    />
                  )}
                  {g.rayon?.name ?? "Autres"}
                </h4>
                <ul className="space-y-1.5">
                  {g.items.map((ing, i) => (
                    <li key={i} className="text-sm text-brun leading-snug">
                      {ing.scaledQty > 0
                        ? formatIngredientNatural(
                            ing.nom,
                            ing.scaledQty,
                            ing.unite,
                            ing.unite_pluriel,
                            ing.nom_pluriel
                          )
                        : ing.nom}
                      {ing.comments.length > 0 && (
                        <span className="text-brun-light italic ml-1">
                          ({ing.comments.join(" ; ")})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        {/* Bloc email — 3 états :
            - idle : 2 boutons Envoyer par email / Fermer
            - form : input email + Envoyer / Annuler
            - sent : message succès + Fermer
         */}
        {emailMode === "sent" ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-2 bg-vert-eau-light/30 border border-vert-eau/30 rounded-lg px-3 py-2.5">
              <svg
                className="w-5 h-5 text-vert-eau flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="text-sm text-brun">
                Liste envoyée à <strong>{emailTo}</strong>. Vérifie ton
                dossier spam si tu ne la reçois pas dans quelques minutes.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-vert-eau text-white rounded-lg hover:bg-vert-eau-light transition-colors text-sm font-medium"
            >
              Fermer
            </button>
          </div>
        ) : emailMode === "form" || emailMode === "sending" || emailMode === "error" ? (
          <form onSubmit={handleSendEmail} className="mt-6 space-y-3">
            <label className="block text-sm font-medium text-brun">
              Envoyer cette liste par email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={emailTo}
              onChange={(e) => {
                setEmailTo(e.target.value)
                setEmailError(null)
                if (emailMode === "error") setEmailMode("form")
              }}
              placeholder="votre@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-brun/10 bg-creme text-sm text-brun placeholder:text-brun-light/40 focus:outline-none focus:ring-2 focus:ring-vert-eau/30"
              disabled={emailMode === "sending"}
            />
            {emailError && (
              <p className="text-xs text-rose">{emailError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmailMode("idle")
                  setEmailError(null)
                }}
                disabled={emailMode === "sending"}
                className="flex-1 py-2.5 border border-brun/10 text-brun rounded-lg hover:bg-creme transition-colors text-sm font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={emailMode === "sending"}
                className="flex-1 py-2.5 bg-vert-eau text-white rounded-lg hover:bg-vert-eau-light transition-colors text-sm font-medium disabled:opacity-60"
              >
                {emailMode === "sending" ? "Envoi…" : "Envoyer"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setEmailMode("form")}
              className="flex-1 py-2.5 border border-brun/10 text-brun rounded-lg hover:bg-creme transition-colors text-sm font-medium"
            >
              Envoyer par email
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-vert-eau text-white rounded-lg hover:bg-vert-eau-light transition-colors text-sm font-medium"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
