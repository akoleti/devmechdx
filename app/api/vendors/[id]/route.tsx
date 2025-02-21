import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching vendor" },
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

    const vendor = await prisma.vendor.update({
      where: {
        id: params.id,
      },
      data: {
        organizationId: body.organizationId,
        organization: body.organization,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating vendor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vendor.delete({  
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting vendor" },
      { status: 500 }
    );
  }
} 