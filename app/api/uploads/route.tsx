import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all uploads
export async function GET(request: NextRequest) {
  try {
    const uploads = await prisma.upload.findMany({
      include: {
        logEntry: true,
      },
    });
    return NextResponse.json(uploads);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upload = await prisma.upload.create({
      data: {
        logEntryId: body.logEntryId,
        file: body.file,
        fileName: body.fileName,
        fileType: body.fileType,
        fileSize: body.fileSize,
        fileUrl: body.fileUrl,
        resourceType: body.resourceType,
      },
    });
    return NextResponse.json(upload, { status: 201 });
  } catch (error) {
      return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 