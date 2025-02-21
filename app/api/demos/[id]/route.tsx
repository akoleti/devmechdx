import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';



export async function GET(
  request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const demo = await prisma.requestDemo.findUnique({
      where: {
        id: parseInt(params.id),    
      },
    });

    if (!demo) {
      return NextResponse.json(
        { message: "Demo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(demo);
  } catch (error) {
    console.error("Error fetching demo:", error);
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
    
    const updatedDemo = await prisma.requestDemo.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        numberOfEmployees: body.numberOfEmployees,
        organizationName: body.organizationName,
        // Add any other fields you want to update
      },
    });

    return NextResponse.json(updatedDemo);
  } catch (error) {
    console.error("Error updating demo:", error);
    
    

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 