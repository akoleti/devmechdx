'use server'

import { prisma } from '../prisma'
import { Contact } from '@prisma/client'

export const createContact = async (contact: Contact) => {
    const newContact = await prisma.contact.create({ data: contact })
    return newContact
}   

export const getAllContacts = async () => {
    const contacts = await prisma.contact.findMany()
    return contacts
}   

export const getContactById = async (id: string) => {
    const contact = await prisma.contact.findUnique({ where: { id } })
    return contact
}   

export const updateContact = async (id: string, contact: Contact) => {
    const updatedContact = await prisma.contact.update({ where: { id }, data: contact })
    return updatedContact
}      

export const deleteContact = async (id: string) => {
    const deletedContact = await prisma.contact.delete({ where: { id } })
    return deletedContact
}      

export const getContactByOrganizationId = async (organizationId: string) => {
    const contacts = await prisma.contact.findMany({ where: { organizationId } })
    return contacts
}           

export const getContactByUserId = async (userId: string) => {
    const contacts = await prisma.contact.findMany({ where: { userId } })
    return contacts
}   



export const getContactByOrganizationIdAndUserId = async (organizationId: string, userId: string) => {
    const contacts = await prisma.contact.findMany({ where: { organizationId, userId } })
    return contacts
}   







