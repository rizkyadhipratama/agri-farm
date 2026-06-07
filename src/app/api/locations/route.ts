import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const locations = await prisma.farmLocation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const location = await prisma.farmLocation.create({
      data: {
        name: body.name,
        address: body.address,
        hectares: body.hectares ? parseFloat(body.hectares) : 0,
        latitude: body.latitude,
        longitude: body.longitude,
        description: body.description,
      },
    });
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
