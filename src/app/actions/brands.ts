"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function createBrand(data: { name: string, bottlesPerBox: number, standardPrice: number, mrpPrice: number, boxPrice: number }) {
  const brand = await prisma.brand.create({
    data: {
      ...data,
      godownInventory: { create: { boxes: 0 } },
      counterInventory: { create: { bottles: 0 } }
    }
  })
  revalidatePath('/settings')
  return brand
}

export async function updateBrand(id: number, data: { name: string, bottlesPerBox: number, standardPrice: number, mrpPrice: number, boxPrice: number }) {
  const brand = await prisma.brand.update({
    where: { id },
    data
  })
  revalidatePath('/settings')
  return brand
}

export async function deleteBrand(id: number) {
  // Cascading deletes usually handled in schema, but for safety in Prisma we might need explicit dependent deletion if not set.
  // Actually, we should just prevent deleting a brand if it has inventory, or soft-delete it. 
  // For simplicity, we'll try a raw delete.
  await prisma.brand.delete({
    where: { id }
  })
  revalidatePath('/settings')
}
