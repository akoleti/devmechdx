import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all organizations
export async function GET() {
  try {
    const organizations = await prisma.organization.findMany();
    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

// POST create new organization
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const organization = await prisma.organization.create({
      data: {
        name: body.name,
        type: body.type,
        ownerId: body.ownerId,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        owner: body.owner,
        plan: body.plan,
        planId: body.planId,
        planStatus: body.planStatus,
        planStartDate: body.planStartDate,
        planEndDate: body.planEndDate,
      },
    });
    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
} 