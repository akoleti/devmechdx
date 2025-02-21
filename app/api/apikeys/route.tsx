import { NextResponse } from "next/server";
import { prisma }   from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId } = body;  

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Generate a random API key
    const key = Math.random().toString(36).substring(2) + 
                Math.random().toString(36).substring(2) + 
                Math.random().toString(36).substring(2);

    const apiKey = await prisma.apiKey.create({
      data: {
        name,   
        key,
        userId
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const apiKeys = await prisma.apiKey.findMany();

    return NextResponse.json(apiKeys);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 