import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '@/db/index';
// Define validation schema for registration data
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate the registration data
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          message: 'Invalid registration data', 
          errors: result.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await db.user.create({
      data: {
        name: email.split('@')[0], // Use part of email as name
        email,
        hashedPassword,
      },
    });
    
    // Return success but don't include sensitive data
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: user.id
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 