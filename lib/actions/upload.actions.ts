'use server'

import { prisma } from '../prisma'
import { Upload } from '@prisma/client'

export const createUpload = async (upload: Upload) => {
    const newUpload = await prisma.upload.create({ data: upload })
    return newUpload
}   

export const getAllUploads = async () => {
    const uploads = await prisma.upload.findMany()
    return uploads
}      

export const getUploadById = async (id: string) => {
    const upload = await prisma.upload.findUnique({ where: { id } })
    return upload
}   

export const updateUpload = async (id: string, upload: Upload) => {
    const updatedUpload = await prisma.upload.update({ where: { id }, data: upload })
    return updatedUpload
}   

export const deleteUpload = async (id: string) => {
    const deletedUpload = await prisma.upload.delete({ where: { id } })
    return deletedUpload
}   












