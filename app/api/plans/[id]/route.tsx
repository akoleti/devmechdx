import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        id: params.id,    
      },
    });

    if (!plan) {
      console.error("Plan not found");
      return NextResponse.json(
        { message: "Plan not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
        { message: "Plan not found", notFound: true },
        { status: 404 }
      );
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    
    const updatedPlan = await prisma.plan.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        },
    });

    if (!updatedPlan) {
      return NextResponse.json(
        { message: "Plan not found", notFound: true },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPlan);
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

    const deletedPlan = await prisma.plan.delete({
      where: { id },
    });

    if (!deletedPlan) {
      return NextResponse.json(
        { message: "Plan not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedPlan);
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

    const newPlan = await prisma.plan.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
      },
    });

    if (!newPlan) {
      return NextResponse.json(
        { message: "Failed to create plan", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newPlan);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

