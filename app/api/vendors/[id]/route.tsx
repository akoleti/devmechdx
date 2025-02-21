import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



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
      console.error("Vendor not found");
      return NextResponse.json(
        { message: "Vendor not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json(
        { message: "Vendor not found", notFound: true },
        { status: 404 }
      );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedVendor = await prisma.vendor.update({
      where: {
        id: params.id,
      },
      data: {
        organizationId: body.organizationId,
        },
    });

    if (!updatedVendor) {
      return NextResponse.json(
          { message: "Vendor not found", notFound: true },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedVendor);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const deletedVendor = await prisma.vendor.delete({
      where: { id },
    });

    if (!deletedVendor) {
      return NextResponse.json(
        { message: "Vendor not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedVendor);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newVendor = await prisma.vendor.create({
      data: { 
        organizationId: body.organizationId,
      },
    });

    if (!newVendor) {
      return NextResponse.json(
        { message: "Failed to create vendor", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newVendor);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

