import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all alerts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    const alerts = await prisma.alert.findMany({
      where: organizationId ? {
        organizationId: organizationId,
      } : undefined,
      include: {
        byUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching alerts" },
      { status: 500 }
    );
  }
}

// POST create new alert
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const alert = await prisma.alert.create({
      data: {
        type: body.type,
        byUserId: body.byUserId,
        organizationId: body.organizationId,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating alert" },
      { status: 500 }
    );
  }
} 