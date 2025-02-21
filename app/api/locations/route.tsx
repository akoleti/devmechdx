import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const location = await prisma.location.create({
      data: json,
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
} 