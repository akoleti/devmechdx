import { NextRequest, NextResponse } from "next/server";
import { renderEmailTemplate } from "@/lib/emailRenderer";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

// Define the request schema
const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  templateName: z.string(),
  templateData: z.record(z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const { to, templateName, templateData } = sendEmailSchema.parse(body);

    // Render the email template
    const template = await renderEmailTemplate(templateName, templateData);

    // Send the email
    const result = await sendEmail({
      to,
      template,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending email:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

// Example usage:
/*
POST /api/email
{
  "to": "user@example.com",
  "templateName": "welcome",
  "templateData": {
    "name": "John Doe",
    "dashboardUrl": "https://app.devmechdx.com/dashboard"
  }
}
*/ 