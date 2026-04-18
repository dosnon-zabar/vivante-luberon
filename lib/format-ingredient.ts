/**
 * Format an ingredient for natural French display.
 *
 * Rules:
 *  - Unit is "pcs" or piece-like → "{qty} {name}" (no unit shown)
 *    e.g. "1 citron", "2 citrons"
 *  - Otherwise → "{qty} {unit} de/d' {name}"
 *    e.g. "10 cl d'eau", "500 g de farine", "2 bottes de ciboulette"
 *  - "d'" before vowels and h muet, "de" before consonants
 *  - No quantity (null/0) → just the name
 *  - Plural on unit uses abbreviation_plural from DB when available
 *  - Plural on ingredient name when piece unit and qty >= 2
 */

const PIECE_UNITS = ["pcs", "pièce", "pièces", "piece", "u"]

export function formatIngredientNatural(
  name: string,
  quantity: number | null,
  unitAbbrev: string | null | undefined,
  unitAbbrevPlural?: string | null,
  namePlural?: string | null
): string {
  const n = name.toLowerCase()
  const rawQty = quantity ?? 0

  if (!rawQty && !unitAbbrev) return n
  if (!rawQty) return n

  // Round to 2 decimals, strip trailing zeros (10.50 → 10.5, 3.00 → 3)
  const qty = Math.round(rawQty * 100) / 100

  const isPiece = !unitAbbrev || PIECE_UNITS.includes(unitAbbrev.toLowerCase())

  if (isPiece) {
    // Pluralize ingredient name when qty >= 2
    let displayName = n
    if (qty >= 2) {
      if (namePlural && namePlural.trim()) {
        displayName = namePlural.trim().toLowerCase()
      } else if (!n.endsWith("s") && !n.endsWith("x") && !n.endsWith("z")) {
        displayName = n + "s"
      }
    }
    return `${qty} ${displayName}`
  }

  // Use plural abbreviation from DB if available
  let displayUnit = unitAbbrev || ""
  if (qty >= 2 && unitAbbrevPlural) {
    displayUnit = unitAbbrevPlural
  }

  // Determine de/d'
  const startsWithVowel = /^[aeiouyàâäéèêëïîôùûüœæh]/i.test(n)
  const liaison = startsWithVowel ? "d'" : "de "

  return `${qty} ${displayUnit} ${liaison}${n}`
}
