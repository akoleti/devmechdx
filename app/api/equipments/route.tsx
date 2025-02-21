import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(equipments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch equipments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const equipment = await prisma.equipment.create({
      data: json,
    });

    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    );
  }
} 