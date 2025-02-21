import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const location = await prisma.location.findUnique({
      where: {
        id: params.id,    
      },
    });

    if (!location) {
      console.error("Location not found");
      return NextResponse.json(
        { message: "Location not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json(
        { message: "Location not found", notFound: true },
        { status: 404 }
      );
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    
    const updatedLocation = await prisma.location.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        country: body.country,
        contactId: body.contactId,
        organizationId: body.organizationId,
        equipments: body.equipments,
        logEntry: body.logEntry,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        organization: body.organization,
        contact: body.contact,
      },
    });

    if (!updatedLocation) {
      return NextResponse.json(
        { message: "Location not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLocation);
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

    const deletedLocation = await prisma.location.delete({
      where: { id },
    });

    if (!deletedLocation) {
      return NextResponse.json(
        { message: "Location not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedLocation);
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

    const newLocation = await prisma.location.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        country: body.country,
        contactId: body.contactId,
        organizationId: body.organizationId,
        equipments: body.equipments,
        logEntry: body.logEntry,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        organization: body.organization,
        contact: body.contact,
      },
    });

    if (!newLocation) {
      return NextResponse.json(
        { message: "Failed to create location", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newLocation);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

