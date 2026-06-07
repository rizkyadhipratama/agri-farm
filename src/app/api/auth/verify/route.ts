import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=missing_token", req.nextUrl.origin));
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=invalid_or_expired_token", req.nextUrl.origin));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExp: null,
      },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.nextUrl.origin));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/login?error=verification_failed", req.nextUrl.origin));
  }
}
