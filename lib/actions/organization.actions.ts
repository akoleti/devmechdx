'use server'

import { Organization } from '@prisma/client'
import { prisma } from '../prisma'

export const createOrganization = async (organization: Organization) => {
    const newOrganization = await prisma.organization.create({ data: organization })

    return { newOrganization }
}

export const getOrganization = async (id: string) => {
    const organization = await prisma.organization.findUnique({ where: { id } })

        return { organization }
}

export const getOrganizations = async () => {
    const organizations = await prisma.organization.findMany()

    return { organizations }
}

export const updateOrganization = async (id: string, organization: Organization) => {
    const updatedOrganization = await prisma.organization.update({ where: { id }, data: organization })

    return { updatedOrganization }
}

export const deleteOrganization = async (id: string) => {
    const deletedOrganization = await prisma.organization.delete({ where: { id } })

    return { deletedOrganization }
}

export const getUsersByOrganizationId = async (organizationId: string) => {
    const users = await prisma.organizationUser.findMany({ where: { organizationId } })

    return { users }
}

export const getOrganizationByUserId = async (userId: string) => {
    const organization = await prisma.organization.findMany({ where: { users: { some: { id: userId } } } })

    return { organization }
}




