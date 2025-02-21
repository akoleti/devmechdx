import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: context.params.id,
      },
    });

    if (!activity) {
      console.error("Activity not found");
      return NextResponse.json(
        { message: "Activity not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json(
        { message: "Activity not found", notFound: true },
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
    
    const updatedActivity = await prisma.activity.update({
      where: {
        id: params.id,
      },
      data: {
        resourceId: body.resourceId,
        activityType: body.activityType,
        activityDate: body.activityDate,
        byUser: body.byUser,
        organization: body.organization,
        organizationId: body.organizationId,
        },
    });

    if (!updatedActivity) {
      return NextResponse.json(
        { message: "Activity not found", notFound: true },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedActivity);
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

    const deletedActivity = await prisma.activity.delete({
      where: { id },
    });

    if (!deletedActivity) {
      return NextResponse.json(
        { message: "Activity not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedActivity);
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

    const newActivity = await prisma.activity.create({
      data: { 
        resourceId: body.resourceId,
        activityType: body.activityType,
        activityDate: body.activityDate,
        byUser: body.byUser,
        organization: body.organization,
        organizationId: body.organizationId,
      },
    });

    if (!newActivity) {
      return NextResponse.json(
        { message: "Failed to create activity", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newActivity);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

