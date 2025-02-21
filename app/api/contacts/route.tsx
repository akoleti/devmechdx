import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        locations: true,
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await prisma.contact.create({
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

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create contact" },
      { status: 500 }
    );
  }
} 