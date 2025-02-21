import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const equipmentDesign = await prisma.equipmentDesignInfo.findUnique({
      where: {
        id: params.id,
      },
      include: {
        equipment: true,
      },
    });

    if (!equipmentDesign) {
      return NextResponse.json(
        { error: "Equipment design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipmentDesign);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch equipment design" },
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
    const equipmentDesign = await prisma.equipmentDesignInfo.update({
      where: {
        id: params.id,
      },
      data: {
        equipmentId: body.equipmentId,
        designType: body.designType,
        designTypeDescription: body.designTypeDescription,
        designValue: body.designValue,
        checklist: body.checklist,
      },
      include: {
        equipment: true,
      },
    });
    return NextResponse.json(equipmentDesign);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update equipment design" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.equipmentDesignInfo.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Equipment design deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete equipment design" },
      { status: 500 }
    );
  }
} 