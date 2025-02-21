import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



export async function GET(
  request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id: params.id,    
      },
    });

    if (!equipment) {
      console.error("Equipment not found");
      return NextResponse.json(
        { message: "Equipment not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json(
        { message: "Equipment not found", notFound: true },
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
    
    const updatedEquipment = await prisma.equipment.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        type: body.type,
        archived: body.archived,
        serialNumber: body.serialNumber,
        modelNumber: body.modelNumber,
        refrigerantType: body.refrigerantType,
        nickname: body.nickname,
        description: body.description,
        locationId: body.locationId,
        organizationId: body.organizationId,
        designInfo: body.designInfo,
        logEntry: body.logEntry,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        organization: body.organization,
        location: body.location,
      },
    });

    if (!updatedEquipment) {
      return NextResponse.json(
        { message: "Equipment not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEquipment);
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

    const deletedEquipment = await prisma.equipment.delete({
      where: { id },
    });

    if (!deletedEquipment) {
      return NextResponse.json(
        { message: "Equipment not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedEquipment);
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
    const newEquipment = await prisma.equipment.create({
      data: {
        name: body.name,
        type: body.type,
        archived: body.archived,
        serialNumber: body.serialNumber,
        modelNumber: body.modelNumber,
        refrigerantType: body.refrigerantType,
        nickname: body.nickname,
        description: body.description,
        locationId: body.locationId,
        organizationId: body.organizationId,
        logEntry: body.logEntry,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        organization: body.organization,
        location: body.location,
        designInfo: body.designInfo,
      },
    });

    if (!newEquipment) {
      return NextResponse.json(
        { message: "Failed to create equipment", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newEquipment);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

