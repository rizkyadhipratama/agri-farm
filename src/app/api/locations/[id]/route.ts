import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const location = await prisma.farmLocation.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address,
        hectares: body.hectares ? parseFloat(body.hectares) : undefined,
        description: body.description || null,
      },
    });
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.farmLocation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
