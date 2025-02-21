import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
      const body = await request.json();

    const { name, description, price } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 