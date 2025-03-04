const { PrismaClient, Role, OrganizationType, OrganizationPlanStatus } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function cleanDatabase() {
  // Delete all records in reverse order of dependencies
  await prisma.session.deleteMany();
  await prisma.organizationUser.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();
}

async function main() {
  console.log('Seeding database...');

  // Clean up existing data 
  await cleanDatabase();

  // Create plans
  const starterPlan = await prisma.plan.create({
    data: {
      name: 'Starter',
      description: 'Perfect for small facilities',
      price: 299,
      isActive: true,
      features: [
        'Up to 5 HVAC units',
        'Basic monitoring',
        'Email support',
        'Mobile app access',
        'Weekly reports'
      ],
      trialDays: 14,
      savings: 598,
      requiresCard: false
    },
  });

  const professionalPlan = await prisma.plan.create({
    data: {
      name: 'Professional',
      description: 'Ideal for medium-sized buildings',
      price: 599,
      isActive: true,
      features: [
        'Up to 20 HVAC units',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom alerts',
        'Daily reports',
        'Energy optimization',
        'Maintenance scheduling'
      ],
      trialDays: 30,
      savings: 1198,
      requiresCard: false,
      isPopular: true
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'For large organizations',
      price: 0, // Custom pricing
      isActive: true,
      features: [
        'Unlimited HVAC units',
        'Predictive maintenance',
        'Dedicated support',
        'Custom integration',
        'Advanced security',
        'Real-time monitoring',
        'Multi-site management',
        'Custom reporting',
        'SLA guarantee'
      ],
      isCustom: true
    },
  });

  console.log('Created plans');

  // Create users
  const adminPassword = hashPassword('admin123');
  const userPassword = hashPassword('user123');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      hashedPassword: adminPassword,
      role: Role.ROOT,
      privacyPolicyAccepted: true,
      termsAccepted: true,
    },
  });

  const techUser = await prisma.user.create({
    data: {
      name: 'Tech User',
      email: 'tech@example.com',
      hashedPassword: userPassword,
      role: Role.TECHNICIAN,
      privacyPolicyAccepted: true,
      termsAccepted: true,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@example.com',
      hashedPassword: userPassword,
      role: Role.MANAGER,
      privacyPolicyAccepted: true,
      termsAccepted: true,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Customer User',
      email: 'customer@example.com',
      hashedPassword: userPassword,
      role: Role.CUSTOMER,
      privacyPolicyAccepted: true,
      termsAccepted: true,
    },
  });

  console.log('Created users');

  // Create organizations
  const acmeOrg = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      type: OrganizationType.CUSTOMER,
      ownerId: adminUser.id,
      planId: enterprisePlan.id,
      planStatus: OrganizationPlanStatus.ACTIVE,
      planStartDate: new Date(),
      planEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      isActive: true,
      isVerified: true,
    },
  });

  const techSupportOrg = await prisma.organization.create({
    data: {
      name: 'Tech Support Inc',
      type: OrganizationType.VENDOR,
      ownerId: techUser.id,
      planId: professionalPlan.id,
      planStatus: OrganizationPlanStatus.ACTIVE,
      planStartDate: new Date(),
      planEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      isActive: true,
      isVerified: true,
    },
  });

  const smallBizOrg = await prisma.organization.create({
    data: {
      name: 'Small Business LLC',
      type: OrganizationType.CUSTOMER,
      ownerId: customerUser.id,
      planId: starterPlan.id,
      planStatus: OrganizationPlanStatus.ACTIVE,
      planStartDate: new Date(),
      planEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      isActive: true,
      isVerified: true,
    },
  });

  console.log('Created organizations');

  // Create organization user relationships with different roles
  // Admin user is part of all organizations with different roles
  await prisma.organizationUser.create({
    data: {
      organizationId: acmeOrg.id,
      userId: adminUser.id,
      role: Role.ADMINISTRATOR,
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.organizationUser.create({
    data: {
      organizationId: techSupportOrg.id,
      userId: adminUser.id,
      role: Role.MANAGER,
      isActive: true,
      isVerified: true,
    },
  });

  await prisma.organizationUser.create({
    data: {
      organizationId: smallBizOrg.id,
      userId: adminUser.id,
      role: Role.USER,
      isActive: true,
      isVerified: true,
    },
  });

  // Tech user is part of tech support org
  await prisma.organizationUser.create({
    data: {
      organizationId: techSupportOrg.id,
      userId: techUser.id,
      role: Role.TECHNICIAN,
      isActive: true,
      isVerified: true,
    },
  });

  // Manager user is part of Acme Corp
  await prisma.organizationUser.create({
    data: {
      organizationId: acmeOrg.id,
      userId: managerUser.id,
      role: Role.MANAGER,
      isActive: true,
      isVerified: true,
    },
  });

  // Customer user is part of Small Business LLC
  await prisma.organizationUser.create({
    data: {
      organizationId: smallBizOrg.id,
      userId: customerUser.id,
      role: Role.CUSTOMER,
      isActive: true,
      isVerified: true,
    },
  });

  console.log('Created organization user relationships');

  // Create sessions for users
  await prisma.session.create({
    data: {
      id: adminUser.id,
      userId: adminUser.id,
      currentOrganizationId: acmeOrg.id,
    },
  });

  await prisma.session.create({
    data: {
      id: techUser.id,
      userId: techUser.id,
      currentOrganizationId: techSupportOrg.id,
    },
  });

  await prisma.session.create({
    data: {
      id: managerUser.id,
      userId: managerUser.id,
      currentOrganizationId: acmeOrg.id,
    },
  });

  await prisma.session.create({
    data: {
      id: customerUser.id,
      userId: customerUser.id,
      currentOrganizationId: smallBizOrg.id,
    },
  });

  console.log('Created sessions');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 