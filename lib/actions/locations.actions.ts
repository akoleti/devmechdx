'use server'

import { prisma } from '../prisma'
import { Location } from '@prisma/client'

export const createLocation = async (location: Location) => {
    const newLocation = await prisma.location.create({
        data: {
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state,
            zip: location.zip,
            country: location.country,
            organizationId: location.organizationId,
            contactId: location.contactId,
        },
    })
    return newLocation
}

export const getAllLocations = async () => {
    const locations = await prisma.location.findMany()
    return locations
}

export const getLocationById = async (id: string) => {
    const location = await prisma.location.findUnique({ where: { id } })
    return location
}

export const getLocationsByOrganizationId = async (organizationId: string) => {
    const locations = await prisma.location.findMany({ where: { organizationId } })
    return locations
}

export const updateLocation = async (id: string, location: Location) => {
    const updatedLocation = await prisma.location.update({ where: { id }, data: location })
    return updatedLocation
}

export const deleteLocation = async (id: string) => {
    const deletedLocation = await prisma.location.delete({ where: { id } })
    return deletedLocation
}   

export const getLocationByContactId = async (contactId: string) => {
    const location = await prisma.location.findMany({ where: { contactId } })
    return location
}

