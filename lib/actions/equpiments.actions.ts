'use server'

import { prisma } from '../prisma'
import { Equipment } from '@prisma/client'

export const createEquipment = async (equipment: Equipment) => {
    const newEquipment = await prisma.equipment.create({ data: equipment })
    return newEquipment
}

export const getAllEquipments = async () => {
    const equipments = await prisma.equipment.findMany()
    return equipments
}   

export const getEquipmentById = async (id: string) => {
    const equipment = await prisma.equipment.findUnique({ where: { id } })
    return equipment
}

export const updateEquipment = async (id: string, equipment: Equipment) => {
    const updatedEquipment = await prisma.equipment.update({ where: { id }, data: equipment })
    return updatedEquipment
}

export const deleteEquipment = async (id: string) => {
    const deletedEquipment = await prisma.equipment.delete({ where: { id } })
    return deletedEquipment
}

export const getEquipmentByLocationId = async (locationId: string) => {
    const equipment = await prisma.equipment.findMany({ where: { locationId } })
    return equipment
}   

export const getEquipmentByOrganizationId = async (organizationId: string) => {
    const equipment = await prisma.equipment.findMany({ where: { organizationId } })
    return equipment
}   

 










