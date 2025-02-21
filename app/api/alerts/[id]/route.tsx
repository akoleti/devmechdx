import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single alert
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await prisma.alert.findUnique({
      where: {
        id: params.id,
      },
      include: {
        byUser: true,
      },
    });

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching alert" },
      { status: 500 }
    );
  }
}

// PUT update alert
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const alert = await prisma.alert.update({
      where: {
        id: params.id,
      },
      data: {
        type: body.type,
        byUserId: body.byUserId,
        organizationId: body.organizationId,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating alert" },
      { status: 500 }
    );
  }
}

// DELETE alert
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.alert.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Alert deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting alert" },
      { status: 500 }
    );
  }
} 