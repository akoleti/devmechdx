import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
      },
    });

    if (!audit) {
      return NextResponse.json(
        { message: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(audit);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
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
    const { action, description, userId, resourceType, occurredAt } = body;

    const audit = await prisma.audit.update({
      where: { id: params.id },
      data: { action, description, userId, resourceType, occurredAt },
    }); 

    if (!audit) {
      return NextResponse.json(
        { message: "Audit not found" },
        { status: 404 }
      );
    } 

    return NextResponse.json(audit);
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
    const audit = await prisma.audit.delete({
      where: { id: params.id },
    });

    if (!audit) {
      return NextResponse.json(
        { message: "Audit not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(audit);
  } catch (error) { 
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 



