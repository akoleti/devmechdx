import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/env.mjs";
import { sendEmail } from "@/lib/email";
import { renderEmailTemplate } from "@/lib/emailRenderer";

// Validation schema for demo request
const DemoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  numberOfEmployees: z.number().optional(),
  additionalInfo: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Get origin for use in email links
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://devmechdx.com";
    
    // Parse the request body
    const body = await req.json();
    console.log("Processing demo request:", body);

    // Validate the request
    const validationResult = DemoRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { 
      name, 
      email, 
      phone, 
      organizationName, 
      numberOfEmployees,
      additionalInfo 
    } = validationResult.data;

    console.log(`Saving demo request for ${name} from ${organizationName}`);
    
    // Save the demo request to the database
    const demoRequest = await prisma.requestDemo.create({
      data: {
        name,
        email,
        phone: phone || null,
        organizationName,
        numberOfEmployees: numberOfEmployees || null,
      },
    });

    console.log(`Demo request saved with ID: ${demoRequest.id}`);

    // Send confirmation email to the user
    try {
      console.log(`Preparing confirmation email for ${email}`);
      
      const userEmailTemplate = await renderEmailTemplate("demoRequestConfirmation", {
        name,
        baseUrl: origin,
      });
      
      const userEmailResult = await sendEmail({
        to: email,
        template: userEmailTemplate,
      });
      
      console.log("User confirmation email result:", userEmailResult);
    } catch (emailError: any) {
      console.error("Error sending user confirmation email:", {
        name: emailError.name,
        message: emailError.message,
        stack: emailError.stack,
      });
      // Continue processing even if user email fails
    }

    // Send notification email to admin if DEMO_REQUEST_EMAIL is set
    if (env.DEMO_REQUEST_EMAIL) {
      try {
        console.log(`Preparing admin notification email to ${env.DEMO_REQUEST_EMAIL}`);
        
        const adminEmailTemplate = await renderEmailTemplate("demoRequestNotification", {
          name,
          email,
          phone: phone || "Not provided",
          organizationName,
          numberOfEmployees: numberOfEmployees || 0,
          additionalInfo: additionalInfo || undefined,
        });
        
        const adminEmailResult = await sendEmail({
          to: env.DEMO_REQUEST_EMAIL,
          template: adminEmailTemplate,
        });
        
        console.log("Admin notification email result:", adminEmailResult);
      } catch (emailError: any) {
        console.error("Error sending admin notification email:", {
          name: emailError.name,
          message: emailError.message,
          stack: emailError.stack,
        });
        // Continue processing even if admin email fails
      }
    } else {
      console.warn("DEMO_REQUEST_EMAIL not set - admin notification email not sent");
    }

    // Return success response with data
    return NextResponse.json({
      success: true,
      message: "Demo request received successfully",
      data: {
        id: demoRequest.id,
        name,
        email,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error processing demo request:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process demo request", 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 