import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single organization
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}

// PUT update organization
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    const organization = await prisma.organization.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        type: body.type,
        ownerId: body.ownerId,
        owner: body.owner,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        planId: body.planId,
        planStatus: body.planStatus,
        planStartDate: body.planStartDate,
        planEndDate: body.planEndDate,
      },
    });
    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

// DELETE organization
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.organization.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
} 

// POST create organization
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const organization = await prisma.organization.create({
      data: {
        name: body.name,
        type: body.type,
        ownerId: body.ownerId,
        owner: body.owner,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        plan: body.plan,
        planId: body.planId,
        planStatus: body.planStatus,
        planStartDate: body.planStartDate,
        planEndDate: body.planEndDate
      },
    });
    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create organization" }, 
      { status: 500 }
    );
  }
}

