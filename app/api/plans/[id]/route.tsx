import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        id: params.id,
        isDeleted: false,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { name, description, price, isActive, isArchived } = body;

    const plan = await prisma.plan.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price,
        isActive,
        isArchived,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.plan.update({
      where: {
        id: params.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 