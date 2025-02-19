'use server'

import { PrismaClient } from "@prisma/client";



export async function getIndustries( id: number) {
    const prisma = new PrismaClient();
    const industries = await prisma.industry.findMany(
        {
            where: {
                id: {
                    equals: id
                }
            },
            orderBy: {
                name: 'asc'
            }
        }
    );
    return industries;
}