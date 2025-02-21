import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany();
    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching vendors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vendor = await prisma.vendor.create({
      data: {
        organizationId: body.organizationId,
        organization: body.organization,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating vendor" },
      { status: 500 }
    );
  }
} 