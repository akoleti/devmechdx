import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single log
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const log = await prisma.logEntry.findUnique({
      where: {
        id: params.id,
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

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch log entry" },
      { status: 500 }
    );
  }
}

// PUT update log
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    const log = await prisma.logEntry.update({
      where: {
        id: params.id,
      },
      data: {
        workOrderId: body.workOrderId,
        archived: body.archived,
        organizationId: body.organizationId,
        locationId: body.locationId,
        equipmentId: body.equipmentId,
        equipmentDesignInfoId: body.equipmentDesignInfoId,
        conclusion: body.conclusion,
        action: body.action,
        technicianId: body.technicianId,
        notes: body.notes,
        images: body.images,
        video: body.video,
        audio: body.audio,
        pdf: body.pdf,
        verified: body.verified,
        locked: body.locked,
        lockedByUserId: body.lockedByUserId,
        lockTS: body.lockTS,
        costAnalysis: body.costAnalysis,
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
      { error: "Failed to update log entry" },
      { status: 500 }
    );
  }
}

// DELETE log
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.logEntry.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Log entry deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete log entry" },
      { status: 500 }
    );
  }
} 