import { NextResponse } from "next/server";
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const industry = await prisma.industry.findUnique({
      where: {
        id: parseInt(params.id),    
      },
      include: {
        caseStudies: true, // Include related case studies if needed
      },
    });

    if (!industry) {
      return NextResponse.json(
        { message: "Industry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(industry);
  } catch (error) {
    console.error("Error fetching industry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
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
    
    const updatedIndustry = await prisma.industry.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
        content: body.content,
        slug: body.slug,
        // Add any other fields you want to update
      },
    });

    return NextResponse.json(updatedIndustry);
  } catch (error) {
    console.error("Error updating industry:", error);
    
    

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 