import { NextResponse } from "next/server";

/**
 * POST /api/debug/invitation
 * Debug endpoint for troubleshooting invitation issues
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the request details
    console.log("Debug Invitation Request:", {
      body,
      headers: Object.fromEntries([...request.headers.entries()]),
      url: request.url,
      method: request.method,
    });
    
    return NextResponse.json({
      success: true,
      message: "Request details logged for debugging",
      receivedData: body
    });
  } catch (error) {
    console.error("Error in debug invitation endpoint:", error);
    return NextResponse.json(
      { 
        error: 'Failed to process debug request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 