'use server'

import { prisma } from '../prisma'
import { Alert } from '@prisma/client'

export const createAlert = async (alert: Alert) => {
    const newAlert = await prisma.alert.create({ data: alert })
    return newAlert
}       

export const getAllAlerts = async () => {
    const alerts = await prisma.alert.findMany()
    return alerts
}   

export const getAlertById = async (id: string) => {
    const alert = await prisma.alert.findUnique({ where: { id } })
    return alert
}   

export const updateAlert = async (id: string, alert: Alert) => {
    const updatedAlert = await prisma.alert.update({ where: { id }, data: alert })
    return updatedAlert
}      

export const deleteAlert = async (id: string) => {
    const deletedAlert = await prisma.alert.delete({ where: { id } })
    return deletedAlert
}      

export const getAlertByOrganizationId = async (organizationId: string) => {
    const alerts = await prisma.alert.findMany({ where: { organizationId } })
    return alerts
}      








