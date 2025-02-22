'use server'

import { z } from 'zod'
import { prisma } from '../prisma'
import { genSaltSync, hash, hashSync, compareSync } from "bcrypt-ts";
import { ApiKey, Role } from '@prisma/client';

export const createUser = async (formData: FormData) => {
    const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),    
    })  

    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })  

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }   
    
    const { name, email, password } = validatedFields.data

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        },
    })

    return { user }
}

export const verifyUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    
    if (!user) {
        return { error: 'User not found' }
    }

    const isPasswordValid = compareSync(password, user.hashedPassword)

    if (!isPasswordValid) {
        return { error: 'Invalid password' }        
    }

    return { user }
}   

export const verifyEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    
    if (!user) {
        return { error: 'User not found' }
    }

    return { user }
}

export const getUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    })

    if (!user) {
        return { error: 'User not found' }
    }

    return { user }     
}

export const updateUser = async (id: string, data: any) => {
    const user = await prisma.user.update({
        where: { id },
        data,
    })

    return { user }
}                           

export const deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
        where: { id },
    })

    return { user }
}

export const getUsers = async () => {
    const users = await prisma.user.findMany()

    return { users }
}   

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    })

    return { user }
}   

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    })

    return { user }
}   


export const getUserByRole = async (role: Role) => {
    const users = await prisma.user.findMany({
        where: { role: role },
    })

    return { users }
}   

export const getUserByOrganizationId = async (organizationId: string) => {
    const users = await prisma.organizationUser.findMany({
        where: {
            organization: {
                id: organizationId,
            },
        },  
    })
    return { users }
}

export const getAllOrganizationsByUserId = async (userId: string) => {
    const organizations = await prisma.organizationUser.findMany({
        where: { userId },
    })
    return { organizations }
}

export const getAllUsersByOrganizationId = async (organizationId: string) => {
    const users = await prisma.organizationUser.findMany({
        where: { organizationId },
    })
    return { users }
}

export const alertUser = async (userId: string, message: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return { user }
}

export const actionUser = async (userId: string, action: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return { user }
}

export const  activityUser = async (userId: string, activity: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return { user }
}

export const auditUser = async (userId: string, audit: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return { user }
}   

export const uploadUser = async (userId: string, upload: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return { user }
}


export const getApiKeysByUserId  = async (userId: string) => {
    const apiKeys = await prisma.apiKey.findMany({
        where: { userId },
    })
    return { apiKeys }
}

export const getApiKeyById = async (id: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { id },
    })
    return { apiKey }
}

export const updateApiKey = async (id: string, apiKey: ApiKey) => {
    const updatedApiKey = await prisma.apiKey.update({
        where: { id },
        data: apiKey,
    })
    return { updatedApiKey }
}

export const deleteApiKey = async (id: string) => {
    const deletedApiKey = await prisma.apiKey.delete({
        where: { id },
    })
        return { deletedApiKey }
}
