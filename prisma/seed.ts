import { PrismaClient, Role, OrganizationType, OrganizationPlanStatus, EquipmentType, EquipmentDesignInfoType } from '@prisma/client';
import { hashPassword } from '../lib/auth/password.js';

const prisma = new PrismaClient();

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
  const freePlan = await prisma.plan.create({
    data: {
      name: 'Free',
      description: 'Perfect for small teams and startups',
      price: 0,
      isActive: true,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      description: 'Ideal for growing organizations',
      price: 299,
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      price: 999,
      isActive: true,
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
      planId: proPlan.id,
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
      planId: freePlan.id,
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

  // Create contacts for organizations
  const acmeContact = await prisma.contact.create({
    data: {
      userId: adminUser.id,
      organizationId: acmeOrg.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phone: '555-123-4567',
      verified: true,
    },
  });

  const techSupportContact = await prisma.contact.create({
    data: {
      userId: techUser.id,
      organizationId: techSupportOrg.id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@techsupport.com',
      phone: '555-987-6543',
      verified: true,
    },
  });

  const smallBizContact = await prisma.contact.create({
    data: {
      userId: customerUser.id,
      organizationId: smallBizOrg.id,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@smallbiz.com',
      phone: '555-567-8901',
      verified: true,
    },
  });

  console.log('Created contacts');

  // Create locations for organizations
  const acmeLocation = await prisma.location.create({
    data: {
      name: 'Acme Headquarters',
      address: '123 Acme St',
      city: 'Metropolis',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      contactId: acmeContact.id,
      organizationId: acmeOrg.id,
    },
  });

  const techSupportLocation = await prisma.location.create({
    data: {
      name: 'Tech Support Office',
      address: '456 Tech Blvd',
      city: 'Silicon Valley',
      state: 'CA',
      zip: '94025',
      country: 'USA',
      contactId: techSupportContact.id,
      organizationId: techSupportOrg.id,
    },
  });

  const smallBizLocation = await prisma.location.create({
    data: {
      name: 'Small Business Shop',
      address: '789 Main St',
      city: 'Smalltown',
      state: 'OH',
      zip: '43210',
      country: 'USA',
      contactId: smallBizContact.id,
      organizationId: smallBizOrg.id,
    },
  });

  console.log('Created locations');

  // Create equipments
  const acmeEquipment1 = await prisma.equipment.create({
    data: {
      name: 'Acme Chiller 1',
      type: EquipmentType.AIR_COOLED_CHILLER,
      serialNumber: 'ACH-001',
      modelNumber: 'ACH-2023',
      refrigerantType: 'R-134a',
      nickname: 'Main Office Chiller',
      description: 'Primary cooling system for main office',
      locationId: acmeLocation.id,
      organizationId: acmeOrg.id,
    },
  });

  const acmeEquipment2 = await prisma.equipment.create({
    data: {
      name: 'Acme Boiler 1',
      type: EquipmentType.HOT_WATER_BOILER,
      serialNumber: 'AHB-001',
      modelNumber: 'AHB-2023',
      refrigerantType: 'N/A',
      nickname: 'Main Office Boiler',
      description: 'Primary heating system for main office',
      locationId: acmeLocation.id,
      organizationId: acmeOrg.id,
    },
  });

  const smallBizEquipment = await prisma.equipment.create({
    data: {
      name: 'Small Biz Chiller',
      type: EquipmentType.AIR_COOLED_CHILLER,
      serialNumber: 'SBC-001',
      modelNumber: 'SBC-2022',
      refrigerantType: 'R-410A',
      nickname: 'Shop Chiller',
      description: 'Main cooling system for retail shop',
      locationId: smallBizLocation.id,
      organizationId: smallBizOrg.id,
    },
  });

  console.log('Created equipment');

  // Create some design info for equipment
  await prisma.equipmentDesignInfo.create({
    data: {
      equipmentId: acmeEquipment1.id,
      designType: EquipmentDesignInfoType.Evaporator,
      designTypeDescription: 'Main evaporator unit',
      designValue: '150 ton',
      checklist: true,
    },
  });

  await prisma.equipmentDesignInfo.create({
    data: {
      equipmentId: acmeEquipment1.id,
      designType: EquipmentDesignInfoType.Compressor,
      designTypeDescription: 'Primary compressor',
      designValue: '200 HP',
      checklist: true,
    },
  });

  console.log('Created equipment design info');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 