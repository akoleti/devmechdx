import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: params.id,
      },
      include: {
        locations: true,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch contact" },
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
    const contact = await prisma.contact.update({
      where: {
        id: params.id,
      },
      data: {
        userId: body.userId,
        organizationId: body.organizationId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        verified: body.verified,
        archived: body.archived,
      },
      include: {
        locations: true,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete contact" },
      { status: 500 }
    );
  }
} 