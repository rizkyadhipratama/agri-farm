import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sales = await prisma.sales.findMany({
      include: { harvest: { include: { product: true } } },
      orderBy: { salesDate: "desc" },
    });
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sales = await prisma.sales.create({
      data: {
        harvestId: body.harvestId,
        quantity: body.quantity,
        unitPrice: body.unitPrice,
        totalPrice: body.quantity * body.unitPrice,
        buyerName: body.buyerName,
        notes: body.notes,
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}
