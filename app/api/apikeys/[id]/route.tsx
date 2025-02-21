import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const apiKey = await prisma.apiKey.update({
      where: {
        id: params.id,
      },
      data: {
        name
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    const apiKey = await prisma.apiKey.delete({
      where: {
        id: params.id,
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 