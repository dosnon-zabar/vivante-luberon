import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchRoles } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json([], { status: 401 });
  }

  const roles = await fetchRoles(session.token);
  return NextResponse.json(roles);
}
