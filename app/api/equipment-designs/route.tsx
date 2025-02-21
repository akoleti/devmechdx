import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const equipmentDesigns = await prisma.equipmentDesignInfo.findMany({
      include: {
        equipment: true,
      },
    });
    return NextResponse.json(equipmentDesigns);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch equipment designs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const equipmentDesign = await prisma.equipmentDesignInfo.create({
      data: {
        equipmentId: body.equipmentId,
        designType: body.designType,
        designTypeDescription: body.designTypeDescription,
        designValue: body.designValue,
        checklist: body.checklist ?? true,
      },
      include: {
        equipment: true,
      },
    });
    return NextResponse.json(equipmentDesign);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create equipment design" },
      { status: 500 }
    );
  }
} 