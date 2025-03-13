import { NextResponse } from "next/server";
import { z } from 'zod';

// Validation schema for request body
const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  role: z.enum(['ADMINISTRATOR', 'MANAGER', 'USER', 'SUPERVISOR', 'TECHNICIAN', 'DISPATCHER', 'ESTIMATOR', 'CUSTOMER']),
  message: z.string().optional(),
  organizationId: z.string(),
});

/**
 * POST /api/admin-test/invite
 * TEST ONLY - DO NOT USE IN PRODUCTION
 * This endpoint logs request data for testing
 */
export async function POST(request: Request) {
  try {
    console.log("TEST INVITE ENDPOINT CALLED");
    
    // Parse and validate the request body
    let body;
    try {
      body = await request.json();
      console.log("Received request body:", body);
      
      const validation = inviteSchema.safeParse(body);
      if (!validation.success) {
        console.error("Validation failed:", validation.error.format());
        return NextResponse.json(
          { error: 'Invalid request data', details: validation.error.format() },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error("Error parsing request body:", e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, role, message, organizationId } = body;
    
    // For testing purposes, we'll log the request details
    console.log("Processing invitation with:", { email, role, organizationId });

    // Instead of trying to create a real invitation, just return a mock success response
    const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockId = Math.random().toString(36).substring(2, 15);

    // Return mock success response
    return NextResponse.json({
      success: true,
      message: `Test invitation would be created for ${email}`,
      mockInvitationId: mockId,
      mockToken: mockToken,
      requestData: {
        email,
        role, 
        organizationId,
        messageLength: message ? message.length : 0
      }
    });
  } catch (error) {
    console.error('Error in test invite endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation', details: String(error) },
      { status: 500 }
    );
  }
} 