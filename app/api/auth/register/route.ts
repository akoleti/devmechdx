import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '@/db/index';
import { generateVerificationToken, formatVerificationCode } from '@/lib/auth/verification-token';
import { env } from '@/env.mjs';
import { renderEmailTemplate } from '@/lib/emailRenderer';
import { sendEmail } from '@/lib/email';

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
    
    // Create the user with emailVerified set to null (unverified)
    const user = await db.user.create({
      data: {
        name: email.split('@')[0], // Use part of email as name
        email,
        hashedPassword,
        emailVerified: null, // Explicitly set as unverified
      },
    });

    // Generate a verification token
    const token = await generateVerificationToken(email);
    const verificationCode = formatVerificationCode(token);
    
    // Create verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    try {
      // Render and send verification email
      const template = await renderEmailTemplate('verification', {
        verificationLink,
        verificationCode,
      });
      
      await sendEmail({
        to: email,
        template,
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We don't want to fail registration if email sending fails
      // But we log it for monitoring
    }
    
    // Return success but don't include sensitive data
    return NextResponse.json(
      { 
        message: 'User registered successfully. Please check your email to verify your account.',
        userId: user.id,
        requiresVerification: true
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