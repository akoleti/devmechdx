'use server'

import { prisma } from '../prisma'
import { LogEntry } from '@prisma/client'

export const createLogEntry = async (logEntry: LogEntry) => {
    const newLogEntry = await prisma.logEntry.create({ data: logEntry })
    return newLogEntry
}   

export const getAllLogEntries = async () => {
    const logEntries = await prisma.logEntry.findMany()
    return logEntries
}   

export const getLogEntryById = async (id: string) => {
    const logEntry = await prisma.logEntry.findUnique({ where: { id } })
    return logEntry
}   

export const updateLogEntry = async (id: string, logEntry: LogEntry) => {
    const updatedLogEntry = await prisma.logEntry.update({ where: { id }, data: logEntry })
    return updatedLogEntry
}   

export const deleteLogEntry = async (id: string) => {
    const deletedLogEntry = await prisma.logEntry.delete({ where: { id } })
    return deletedLogEntry
}   

export const getLogEntryByOrganizationId = async (organizationId: string) => {
    const logEntries = await prisma.logEntry.findMany({ where: { organizationId } })
    return logEntries
}      

export const getLogEntryByEquipmentId = async (equipmentId: string) => {
    const logEntries = await prisma.logEntry.findMany({ where: { equipmentId }, orderBy: { createdAt: 'desc' } })
    return logEntries
}           

export const getLogEntryByLocationId = async (locationId: string) => {
    const logEntries = await prisma.logEntry.findMany({ where: { locationId }, orderBy: { createdAt: 'desc' } })
    return logEntries
}   











