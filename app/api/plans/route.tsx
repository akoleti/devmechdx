import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define plan features
const planFeatures = {
  Free: [
    'Up to 3 HVAC units',
    'Basic monitoring',
    'Email support',
    'Weekly reports'
  ],
  Pro: [
    'Up to 10 HVAC units',
    'Advanced monitoring',
    'Priority support',
    'Daily reports',
    'API access',
    'Custom alerts'
  ],
  Enterprise: [
    'Unlimited HVAC units',
    'Advanced analytics',
    'Dedicated support',
    'Custom integration',
    'Advanced security',
    'Real-time monitoring',
    'Multi-site management',
    'Custom reporting',
    'SLA guarantee'
  ]
};

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isDeleted: false,
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });

    // Add features to each plan
    const plansWithFeatures = plans.map(plan => ({
      ...plan,
      features: planFeatures[plan.name as keyof typeof planFeatures] || []
    }));

    return NextResponse.json(plansWithFeatures);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description, price } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 