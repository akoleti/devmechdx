import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLANS_DATA = [
  {
    id: "2ebc2fa1-1c3c-40db-857c-bb70239cb003",
    name: "Starter 14-day Free Trial",
    description: "For small organizations getting started",
    price: 0,
    trialDays: 14,
    features: [
      "Up to 5 HVAC units",
      "Basic monitoring",
      "Email support",
      "Standard reporting"
    ],
    requiresCard: false,
    isPopular: false,
    isCustom: false
  },
  {
    id: "2a0f5b31-cc79-4b64-a2fd-ed45e79c60ce",
    name: "Professional 30-day Free Trial",
    description: "For medium-sized organizations",
    price:  0,
    trialDays: 30,
    features: [
      "Up to 50 HVAC units",
      "Advanced monitoring",
      "Predictive maintenance",
      "24/7 phone support",
      "Custom reporting",
      "Advanced analytics",
      "Multi-site management"
    ],
    requiresCard: false,
    isPopular: true,
    isCustom: false
  },
  {
    id: "3a1e1a16-a043-4043-bac0-2c117ac00124",
    name: "Starter",
    description: "For growing organizations",
    price: 299,
    features: [
      "Up to 20 HVAC units",
      "Advanced monitoring",
      "Priority email support",
      "Custom reporting",
      "Basic analytics"
    ],
    requiresCard: true,
    isPopular: false,
    isCustom: false
  },
  {
    id: "637a703b-ba7e-4852-803a-bc71a809cd4f",
    name: "Professional",
    description: "For medium-sized organizations",
    price: 599,
    features: [
      "Up to 50 HVAC units",
      "Advanced monitoring",
      "Predictive maintenance",
      "24/7 phone support",
      "Custom reporting",
      "Advanced analytics",
      "Multi-site management"
    ],
    savings: 1000,
    requiresCard: true,
    isPopular: true,
    isCustom: false
  },
  {
    id: "0ab5c742-59ff-4aaa-bc48-e84bc80c21f7",
    name: "Enterprise",
    description: "For large organizations",
    price: 599,
    features: [
      "Unlimited HVAC units",
      "Predictive maintenance",
      "Dedicated support",
      "Custom integration",
      "Advanced security",
      "Real-time monitoring",
      "Multi-site management",
      "Custom reporting",
      "SLA guarantee"
    ],
    requiresCard: true,
    isPopular: false,
    isCustom: true
  }
];

async function main() {
  console.log('Starting to seed plans...');

  // Creating or updating each plan
  for (const plan of PLANS_DATA) {
    console.log(`Processing plan: ${plan.name}`);
    
    // Check if the plan already exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id: plan.id },
    });

    if (existingPlan) {
      // Update existing plan
      await prisma.plan.update({
        where: { id: plan.id },
        data: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          features: plan.features,
          trialDays: plan.trialDays || null,
          savings: plan.savings || null,
          requiresCard: plan.requiresCard,
          isPopular: plan.isPopular,
          isCustom: plan.isCustom,
          isActive: true,
          isDeleted: false,
          isArchived: false,
          updatedAt: new Date(),
        },
      });
      console.log(`Updated plan: ${plan.name}`);
    } else {
      // Create new plan
      await prisma.plan.create({
        data: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          features: plan.features,
          trialDays: plan.trialDays || null,
          savings: plan.savings || null,
          requiresCard: plan.requiresCard,
          isPopular: plan.isPopular,
          isCustom: plan.isCustom,
          isActive: true,
          isDeleted: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`Created plan: ${plan.name}`);
    }
  }

  console.log('Plans seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 