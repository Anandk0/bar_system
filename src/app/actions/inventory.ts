"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGodownInventory() {
  return await prisma.godownInventory.findMany({
    include: { brand: true },
    orderBy: { brand: { name: 'asc' } }
  })
}

export async function addStockToGodown(brandId: number, boxes: number) {
  if (boxes <= 0) throw new Error("Invalid box quantity")

  await prisma.$transaction([
    prisma.transactionHistory.create({
      data: { brandId, type: 'STOCK_IN', quantityBoxes: boxes }
    }),
    prisma.godownInventory.upsert({
      where: { brandId },
      create: { brandId, boxes },
      update: { boxes: { increment: boxes } }
    })
  ])
  
  revalidatePath('/godown')
}

export async function transferToCounter(brandId: number, boxes: number) {
  if (boxes <= 0) throw new Error("Invalid transfer quantity")

  const godown = await prisma.godownInventory.findUnique({ where: { brandId } })
  if (!godown || godown.boxes < boxes) throw new Error("Not enough boxes in Godown inventory")

  const brand = await prisma.brand.findUnique({ where: { id: brandId } })
  if (!brand) throw new Error("Brand not found")

  const bottlesToAdd = boxes * brand.bottlesPerBox

  await prisma.$transaction([
    prisma.godownInventory.update({
      where: { brandId },
      data: { boxes: { decrement: boxes } }
    }),
    prisma.counterInventory.upsert({
      where: { brandId },
      create: { brandId, bottles: bottlesToAdd },
      update: { bottles: { increment: bottlesToAdd } }
    }),
    prisma.transactionHistory.create({
      data: { brandId, type: 'TRANSFER_TO_COUNTER', quantityBoxes: boxes }
    })
  ])
  
  revalidatePath('/godown')
  revalidatePath('/counter')
}
