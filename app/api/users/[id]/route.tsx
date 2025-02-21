import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';
import { error } from "console";



export async function GET(
  request: Request,
    { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,    
      },
    });

    if (!user) {
      console.error("User not found");
      return NextResponse.json(
        { message: "User not found", notFound: true },
        { status: 404 }
      );
    }
    

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
        { message: "User not found", notFound: true },
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
    
    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        email: body.email,
        hashedPassword: body.hashedPassword,
        emailVerified: body.emailVerified,
        image: body.image,
        role: body.role,
        termsAccepted: body.termsAccepted,
        archived: body.archived,
        recoveryToken: body.recoveryToken,
        preferences: body.preferences,
        lastLogin: body.lastLogin,
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
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

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found", notFound: true },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedUser);
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

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        hashedPassword: body.hashedPassword,
        emailVerified: body.emailVerified,
        image: body.image,
        role: body.role,
        termsAccepted: body.termsAccepted,
        archived: body.archived,
        recoveryToken: body.recoveryToken,
        preferences: body.preferences,
        lastLogin: body.lastLogin,
      },
    });

    if (!newUser) {
      return NextResponse.json(
        { message: "Failed to create user", error: error    },
        { status: 400 }
      );
    }

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

