"use client"

/**
 * ShoppingListModal — popin "Liste de courses" sur la fiche recette.
 *
 * Déclenchée par le bouton sous la liste d'ingrédients. L'utilisateur
 * ajuste le nombre de parts (±) et voit la liste se recalculer en
 * direct, groupée par rayon de supermarché.
 *
 * Scope v1 :
 *  - Affichage in-page (pas de PDF, pas de copier/coller — le user
 *    peut `Cmd+P` pour imprimer ; si besoin on ajoutera un bouton
 *    dédié plus tard).
 *  - Groupes d'ingrédients de la recette (ingredient_groups) ignorés
 *    ici : une liste de courses se lit par rayon, pas par sous-recette.
 *  - Quantités non arrondies "intelligemment" — on garde 2 décimales
 *    max, pareil que le PDF manager.
 */

import { useState, useEffect } from "react"
import { formatIngredientNatural } from "@/lib/format-ingredient"
import type { Recette } from "@/lib/types"

interface Props {
  open: boolean
  onClose: () => void
  recette: Recette
}

/** Max 2 décimales, pareil que manager/RecipePdfModal.tsx. */
function roundQty(qty: number): number {
  if (qty === Math.floor(qty)) return qty
  return Math.round(qty * 100) / 100
}

export default function ShoppingListModal({ open, onClose, recette }: Props) {
  const [portions, setPortions] = useState(recette.nombre_parts || 1)

  // Reset les portions quand on change de recette (dans le même onglet
  // via une navigation client-side, par exemple).
  useEffect(() => {
    if (open) setPortions(recette.nombre_parts || 1)
  }, [open, recette.nombre_parts])

  // Ferme la popin avec Échap.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const portionLabel = recette.portion_type || "personnes"
  const multiplier = portions / (recette.nombre_parts || 1)

  // Calcule la liste une fois par render, groupée par rayon.
  const groupedByAisle = (() => {
    // Map id → { rayon, items[] } avec un sentinel "sans-rayon" pour les
    // ingrédients non catégorisés, qui tombent en dernier.
    type Entry = {
      rayon: { id: string; nom: string; color: string } | null
      items: (typeof recette.ingredients[number] & { scaledQty: number })[]
    }
    const map = new Map<string, Entry>()
    for (const ing of recette.ingredients) {
      if (!ing.nom.trim()) continue
      const key = ing.rayon?.id ?? "__no_aisle__"
      const bucket = map.get(key) ?? {
        rayon: ing.rayon ?? null,
        items: [],
      }
      bucket.items.push({
        ...ing,
        scaledQty: ing.quantite ? roundQty(ing.quantite * multiplier) : 0,
      })
      map.set(key, bucket)
    }
    // Tri des rayons par nom, sans-rayon en dernier.
    return [...map.values()].sort((a, b) => {
      if (!a.rayon && b.rayon) return 1
      if (a.rayon && !b.rayon) return -1
      if (!a.rayon || !b.rayon) return 0
      return a.rayon.nom.localeCompare(b.rayon.nom, "fr")
    })
  })()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:bg-white print:static print:p-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Liste de courses"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 print:shadow-none print:rounded-none print:max-h-none print:max-w-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 print:mb-6">
          <h3 className="font-serif text-xl text-brun">Liste de courses</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-brun-light hover:text-brun text-lg leading-none print:hidden"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-brun-light mb-4">
          {recette.nom}
        </p>

        {/* Adjusteur de portions */}
        <div className="bg-creme rounded-lg p-4 mb-5 print:hidden">
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

        {/* Version print du header */}
        <p className="hidden print:block text-sm text-brun mb-4">
          Pour {portions} {portionLabel}
        </p>

        {/* Liste groupée par rayon */}
        <div className="space-y-5">
          {groupedByAisle.length === 0 ? (
            <p className="text-sm text-brun-light italic">
              Pas d&apos;ingrédients dans cette recette.
            </p>
          ) : (
            groupedByAisle.map((g) => (
              <section key={g.rayon?.id ?? "__no_aisle__"}>
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brun-light mb-2">
                  {g.rayon?.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: g.rayon.color }}
                      aria-hidden
                    />
                  )}
                  {g.rayon?.nom ?? "Autres"}
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
                      {ing.commentaire && (
                        <span className="text-brun-light italic ml-1">
                          ({ing.commentaire})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2.5 border border-brun/10 text-brun rounded-lg hover:bg-creme transition-colors text-sm font-medium"
          >
            Imprimer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-terracotta text-white rounded-lg hover:bg-terracotta-dark transition-colors text-sm font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
