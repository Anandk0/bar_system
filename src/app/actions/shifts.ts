"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ShiftCloseData = {
  brandId: number
  physicalClosingBottles: number
  mrpExceptions: { quantity: number, recipientName: string }[]
  freeExceptions: { quantity: number, recipientName: string }[]
}

export async function currentCounterInventory() {
  return await prisma.counterInventory.findMany({
    include: { brand: true },
    orderBy: { brand: { name: 'asc' } }
  })
}

export async function closeDailyShift(counts: ShiftCloseData[]) {
  // Execute closing for all submitted brands inside a single transation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await prisma.$transaction(async (tx: any) => {
    
    // We will save all the new shift records
    const newRecords = []

    for (const count of counts) {
      const brand = await tx.brand.findUnique({ where: { id: count.brandId } })
      if (!brand) continue

      // Find the opening bottles (which is the closing count from the previous shift for this brand)
      const lastShift = await tx.dailyShiftRecord.findFirst({
        where: { brandId: count.brandId },
        orderBy: { date: 'desc' }
      })
      const openingBottles = lastShift ? lastShift.closingBottles : 0

      // Calculate how many bottles were transferred to this specific brand since ITS last shift
      const brandShiftStartTime = lastShift ? lastShift.date : new Date(0)

      const transfers = await tx.transactionHistory.findMany({
        where: {
          brandId: count.brandId,
          type: 'TRANSFER_TO_COUNTER',
          createdAt: { gt: brandShiftStartTime }
        }
      })
      
      const transferredBoxes = transfers.reduce((sum, t) => sum + t.quantityBoxes, 0)
      const transferredBottles = transferredBoxes * brand.bottlesPerBox

      // The math
      const totalAvailable = openingBottles + transferredBottles
      const missingBottles = totalAvailable - count.physicalClosingBottles // Total depleted from counter

      // Exceptions
      const mrpBottles = count.mrpExceptions.reduce((sum, ex) => sum + ex.quantity, 0)
      const freeBottles = count.freeExceptions.reduce((sum, ex) => sum + ex.quantity, 0)

      // Standard bottles sold
      const standardBottlesSold = missingBottles - mrpBottles - freeBottles

      // Revenue calculate
      const totalRevenue = (standardBottlesSold * brand.standardPrice) + (mrpBottles * brand.mrpPrice)

      // Update the Physical Inventory in Counter to exactly match reality
      await tx.counterInventory.upsert({
        where: { brandId: count.brandId },
        create: { brandId: count.brandId, bottles: count.physicalClosingBottles },
        update: { bottles: count.physicalClosingBottles }
      })

      // Create Shift Record
      const shiftRecord = await tx.dailyShiftRecord.create({
        data: {
          brandId: count.brandId,
          openingBottles,
          transferredBottles,
          closingBottles: count.physicalClosingBottles,
          standardBottlesSold,
          mrpBottlesSold: mrpBottles,
          freeBottles,
          totalRevenue
        }
      })

      // Create Exception Logs
      for (const ex of count.mrpExceptions) {
        if (ex.quantity > 0) {
          await tx.exceptionLog.create({
            data: { shiftId: shiftRecord.id, brandId: count.brandId, type: 'MRP', quantity: ex.quantity, recipientName: ex.recipientName }
          })
        }
      }
      for (const ex of count.freeExceptions) {
        if (ex.quantity > 0) {
          await tx.exceptionLog.create({
            data: { shiftId: shiftRecord.id, brandId: count.brandId, type: 'FREE', quantity: ex.quantity, recipientName: ex.recipientName }
          })
        }
      }

      newRecords.push(shiftRecord)
    }

    return newRecords
  })
}

export async function getShiftHistory() {
  return await prisma.dailyShiftRecord.findMany({
    include: { brand: true, exceptions: true },
    orderBy: { date: 'desc' }
  })
}
