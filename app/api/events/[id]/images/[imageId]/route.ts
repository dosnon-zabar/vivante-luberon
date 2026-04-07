import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateEventImage, deleteEventImage } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  }

  const { id, imageId } = await params;
  const body = await request.json();

  const result = await updateEventImage(session.token, id, imageId, body);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  }

  const { id, imageId } = await params;
  const result = await deleteEventImage(session.token, id, imageId);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
