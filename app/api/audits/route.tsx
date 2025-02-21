import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    
    const audits = await prisma.audit.findMany({
      take: limit,
      skip: offset,
      include: {
        user: true,
      },
      orderBy: {
        occurredAt: 'desc'
      }
    });

    const total = await prisma.audit.count();

    return NextResponse.json({
      data: audits,
      metadata: {
        total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error("Error fetching audits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 