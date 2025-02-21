import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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