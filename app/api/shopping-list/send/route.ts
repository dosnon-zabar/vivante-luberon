import { NextResponse } from "next/server"

/**
 * POST /api/shopping-list/send — Proxy vers admin.
 *
 * Site-vivante n'a pas la BDD ni la clé Brevo ; l'envoi réel se fait
 * côté admin via /api/v1/shopping-lists/send. On forward le body
 * untouched, on ajoute la X-API-Key.
 */

const ADMIN_API_URL =
  process.env.CHEFMATE_API_URL || "https://admin.brigades.fr/api/v1"
const API_KEY = process.env.CHEFMATE_API_KEY

export async function POST(request: Request) {
  if (!API_KEY) {
    console.error("shopping-list/send: CHEFMATE_API_KEY missing")
    return NextResponse.json(
      { success: false, error: "Envoi indisponible" },
      { status: 503 },
    )
  }

  try {
    const body = await request.json()

    const res = await fetch(`${ADMIN_API_URL}/shopping-lists/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(body),
    })

    const payload = await res.json().catch(() => ({}))
    return NextResponse.json(payload, { status: res.status })
  } catch (error) {
    console.error("shopping-list/send proxy error:", error)
    return NextResponse.json(
      { success: false, error: "Erreur réseau" },
      { status: 502 },
    )
  }
}
