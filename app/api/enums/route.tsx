import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ActivityType, ResourceType, OrganizationPlan, Role, AlertType, OrganizationPlanStatus, Action, OrganizationType, EquipmentDesignInfoType, EquipmentType } from '@prisma/client';

export async function GET() {
  try {
    // Get all enum values
    const enums = {
      activityTypes: Object.values(ActivityType),
      resourceTypes: Object.values(ResourceType),
      organizationPlans: Object.values(OrganizationPlan),
      roles: Object.values(Role),
      alertTypes: Object.values(AlertType),
      organizationPlanStatuses: Object.values(OrganizationPlanStatus),
      actions: Object.values(Action),
      organizationTypes: Object.values(OrganizationType),
      equipmentDesignInfoTypes: Object.values(EquipmentDesignInfoType),
      equipmentTypes: Object.values(EquipmentType)
    };

    return NextResponse.json(enums);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch enum types' },
      { status: 500 }
    );
  }
} 