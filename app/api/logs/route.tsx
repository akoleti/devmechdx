import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all logs
export async function GET(request: Request) {
  try {
    const logs = await prisma.logEntry.findMany({
      include: {
        organization: true,
        location: true,
        equipment: true,
        equipmentDesignInfo: true,
        technician: true,
        upload: true,
      },
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

// POST new log
export async function POST(request: Request) {
  try {
    const body = await request.json();    
    const log = await prisma.logEntry.create({
      data: {
        workOrderId: body.workOrderId,
        organizationId: body.organizationId,
        locationId: body.locationId,
        equipmentId: body.equipmentId,
        equipmentDesignInfoId: body.equipmentDesignInfoId,
        conclusion: body.conclusion,
        action: body.action,
        technicianId: body.technicianId,
        notes: body.notes,
        images: body.images || [],
        video: body.video || "",
        audio: body.audio || "",
        pdf: body.pdf || "",
        costAnalysis: body.costAnalysis || "",
        lockedByUserId: body.technicianId,
      },
      include: {
        organization: true,
        location: true,
        equipment: true,
        equipmentDesignInfo: true,
        technician: true,
        upload: true,
      },
    });
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create log entry" },
      { status: 500 }
    );
  }
} 