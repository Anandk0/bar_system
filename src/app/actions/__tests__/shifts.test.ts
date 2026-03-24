import { describe, it, expect, vi, beforeEach } from 'vitest'
import { closeDailyShift } from '../shifts'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => cb(prisma)),
    brand: { findUnique: vi.fn() },
    dailyShiftRecord: { findFirst: vi.fn(), create: vi.fn() },
    transactionHistory: { findMany: vi.fn() },
    counterInventory: { upsert: vi.fn() },
    exceptionLog: { create: vi.fn() },
  }
}))

describe('closeDailyShift', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates correct missing bottles and revenue when no exceptions or transfers', async () => {
    
    // Mock brand finding
    // @ts-ignore
    prisma.brand.findUnique.mockResolvedValue({ id: 99, name: 'Vodka', bottlesPerBox: 12, standardPrice: 10, mrpPrice: 12 })
    
    // Mock last shift to give 10 bottles opening balance
    // @ts-ignore
    prisma.dailyShiftRecord.findFirst.mockResolvedValue({ date: new Date(), closingBottles: 10 })
    
    // Mock no transfers recently
    // @ts-ignore
    prisma.transactionHistory.findMany.mockResolvedValue([])

    // Given we close with physical count 4...
    // Total available = 10 + 0 = 10. Missing = 10 - 4 = 6. 
    // Std sales = 6. Rev = 6 * 10 = 60.
    const result = await closeDailyShift([{
      brandId: 99,
      physicalClosingBottles: 4,
      mrpExceptions: [],
      freeExceptions: []
    }])

    expect(prisma.dailyShiftRecord.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        brandId: 99,
        openingBottles: 10,
        transferredBottles: 0,
        closingBottles: 4,
        standardBottlesSold: 6,
        mrpBottlesSold: 0,
        freeBottles: 0,
        totalRevenue: 60
      })
    })
  })
})
