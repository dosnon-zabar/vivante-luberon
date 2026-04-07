import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addEventImage } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const result = await addEventImage(session.token, id, body);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
