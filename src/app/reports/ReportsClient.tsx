"use client"

import { useState } from 'react'
import type { Prisma } from '@prisma/client'
import { DollarSign, Search, CalendarDays, ShieldAlert } from 'lucide-react'

type ShiftItem = Prisma.DailyShiftRecordGetPayload<{ include: { brand: true, exceptions: true } }>

export default function ReportsClient({ history }: { history: ShiftItem[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Simple filtering
  const filtered = history.filter(h => 
    h.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    new Date(h.date).toLocaleDateString().includes(searchTerm)
  )

  const totalRevenueAllTime = history.reduce((sum, h) => sum + h.totalRevenue, 0)
  const totalStandardSales = history.reduce((sum, h) => sum + h.standardBottlesSold, 0)
  const totalMrpSales = history.reduce((sum, h) => sum + h.mrpBottlesSold, 0)
  const totalFree = history.reduce((sum, h) => sum + h.freeBottles, 0)

  return (
    <div className="space-y-8">

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Gross Revenue</p>
          <p className="text-3xl font-black text-amber-500">${totalRevenueAllTime.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Standard Sales</p>
          <p className="text-3xl font-black text-white">{totalStandardSales} <span className="text-lg text-zinc-600 font-medium">btls</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">MRP Sales</p>
          <p className="text-3xl font-black text-blue-400">{totalMrpSales} <span className="text-lg font-medium text-blue-900">btls</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Comp/Free</p>
          <p className="text-3xl font-black text-emerald-400">{totalFree} <span className="text-lg font-medium text-emerald-900">btls</span></p>
        </div>
      </div>

      {/* FILTER */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500"/>
        <input 
          type="text" 
          placeholder="Search by date (e.g., 3/24/2026) or brand..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
        />
      </div>

      {/* SHIFT LOGS */}
      <div className="space-y-4">
        {filtered.map(shift => (
          <div key={shift.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-amber-500" />
                <h3 suppressHydrationWarning className="text-lg font-bold text-white">{new Date(shift.date).toLocaleString()}</h3>
                <span className="px-3 py-1 bg-zinc-950 rounded-full text-xs font-bold text-zinc-400 border border-zinc-800">{shift.brand.name}</span>
              </div>
              <div className="text-2xl font-black text-amber-400">${shift.totalRevenue.toFixed(2)}</div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Opening</p>
                <p className="text-xl font-medium text-zinc-300">{shift.openingBottles}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Transferred In</p>
                <p className="text-xl font-medium text-amber-500">+{shift.transferredBottles}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Closing Count</p>
                <p className="text-xl font-medium text-zinc-300">{shift.closingBottles}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Std Sold</p>
                <p className="text-xl font-bold text-white">{shift.standardBottlesSold}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Missing</p>
                <p className="text-xl font-medium text-red-400">{(shift.openingBottles + shift.transferredBottles) - shift.closingBottles}</p>
              </div>
            </div>

            {/* Exceptions */}
            {shift.exceptions.length > 0 && (
              <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Exception Ledger</h4>
                <div className="space-y-2">
                  {shift.exceptions.map(ex => (
                    <div key={ex.id} className="flex items-center gap-3 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${ex.type === 'MRP' ? 'bg-blue-900/50 text-blue-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                        {ex.type}
                      </span>
                      <span className="text-white font-medium">{ex.quantity} btl(s)</span>
                      <span className="text-zinc-500">given to</span>
                      <span className="text-zinc-300 font-medium italic">{ex.recipientName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-zinc-500 py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
            No shift records found matching your search.
          </div>
        )}
      </div>

    </div>
  )
}
