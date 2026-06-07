import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role?.name !== "guest") {
      return NextResponse.json({ error: "Only guest accounts can be upgraded" }, { status: 400 });
    }

    const operatorRole = await prisma.role.findUnique({ where: { name: "operator" } });
    if (!operatorRole) {
      return NextResponse.json({ error: "System error: operator role not found" }, { status: 500 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { roleId: operatorRole.id },
    });

    return NextResponse.json({ message: "Account upgraded to operator" });
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
  }
}
