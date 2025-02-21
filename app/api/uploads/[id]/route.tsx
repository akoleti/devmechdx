import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// GET single upload
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const upload = await prisma.upload.findUnique({
      where: {
        id: params.id,
      }
    });

    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(upload);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch upload" },
      { status: 500 }
    );
  }
}

// PUT update upload
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    const upload = await prisma.upload.update({
      where: {
        id: params.id,
      },
      data: {
        file: body.file,
        fileName: body.fileName,
        fileType: body.fileType,
        fileSize: body.fileSize,
        fileUrl: body.fileUrl,
        resourceType: body.resourceType,
      },
    });
    return NextResponse.json(upload);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update upload" },
      { status: 500 }
    );
  }
}

// DELETE upload
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.upload.delete({
      where: {
        id: params.id,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to delete upload" },
      { status: 500 }
    );
  }
} 