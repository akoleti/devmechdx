import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';



export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
        

    });

    return NextResponse.json(industries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content, slug, id } = body;

    if (!name || !content || !slug || !id) {
      return NextResponse.json(
        { error: 'Name, content, slug and id are required' },
        { status: 400 }
      );
    }

    const industry = await prisma.industry.create({
      data: {
        name,
        content,
        slug,
        id
      }
    });

    return NextResponse.json(industry, { status: 201 });
  } catch (error) {
    console.error('Error creating industry:', error);
    return NextResponse.json(
      { error: 'Failed to create industry' },
      { status: 500 }
    );
  }
}
