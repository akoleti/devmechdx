import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@prisma/client";

export async function GET(request: Request) {
  try {

    const activities = await prisma.activity.findMany({
      
    });

    return NextResponse.json(activities);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { resourceId, activityType, activityDate } = body;

    if (!resourceId || !activityType || !activityDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate activityType is valid enum value
    if (!Object.values(ActivityType).includes(activityType)) {
      return new NextResponse("Invalid activity type", { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        resourceId,
        activityType,
        activityDate: new Date(activityDate),
        byUserId: body.userId,
        organizationId: body.organizationId,
      }
    });

    return NextResponse.json(activity);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 