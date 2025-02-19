'use server'

import { PrismaClient } from "@prisma/client"
import { DemoInsert } from "@/types"

// Create a singleton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function createDemo(formData: FormData) {
    try{
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const numberOfEmployees = formData.get("numberOfEmployees") as string;
    const organizationName = formData.get("organizationName") as string;
    
    if (!name || !email || !phone || !numberOfEmployees || !organizationName) {
        throw new Error("Missing required fields");
    }
    const demo = await prisma.demos.create({
        data: {
            name: name,
            email: email,
            phone: phone,
            numberOfEmployees: parseInt(numberOfEmployees),
            organizationName: organizationName
        }
    });
    return demo;
    } catch (error) {
        console.error("Error creating demo:", error);
        throw error;
    }
}
