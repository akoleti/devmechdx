import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

    

export async function GET() {
  try {
    const demos = await prisma.requestDemo.findMany({

    });

    return NextResponse.json(demos, { status: 200 });
  } catch (error) {
    console.error('Error fetching demos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, numberOfEmployees, organizationName } = body;

    if (!name || !email || !phone || !numberOfEmployees || !organizationName ) {
      return NextResponse.json(
        { error: 'Name, email, phone, numberOfEmployees, organizationName and message are required' },
        { status: 400 }
      );
    }

     const demo = await prisma.requestDemo.create({
      data: {
        name,
        email,
        phone,
        numberOfEmployees,
        organizationName
      }
    });

    return NextResponse.json(demo, { status: 201 });
  } catch (error) {
    console.error('Error creating demo:', error);
    return NextResponse.json(
      { error: 'Failed to create demo' },
      { status: 500 }
    );
  }
}
