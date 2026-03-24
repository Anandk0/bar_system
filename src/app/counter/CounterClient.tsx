"use client"

import { useState } from 'react'
import { closeDailyShift, ShiftCloseData } from '@/app/actions/shifts'
import { GlassWater, CheckCircle, Plus, Trash2, ShieldAlert } from 'lucide-react'
import type { Prisma } from '@prisma/client'

type CounterItem = Prisma.CounterInventoryGetPayload<{ include: { brand: true } }>
type ExceptionEntry = { quantity: number; recipientName: string }

export default function CounterClient({ inventory }: { inventory: CounterItem[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State maps brandId to its Closing form data
  const [counts, setCounts] = useState<Record<number, {
    physicalClosingBottles: string,
    mrpExceptions: ExceptionEntry[],
    freeExceptions: ExceptionEntry[]
  }>>(
    inventory.reduce((acc, item) => {
      acc[item.brandId] = { physicalClosingBottles: '', mrpExceptions: [], freeExceptions: [] }
      return acc
    }, {} as any)
  )

  const handleBottleChange = (brandId: number, val: string) => {
    setCounts(prev => ({ ...prev, [brandId]: { ...prev[brandId], physicalClosingBottles: val } }))
  }

  const addException = (brandId: number, type: 'mrpExceptions' | 'freeExceptions') => {
    setCounts(prev => ({
      ...prev,
      [brandId]: { ...prev[brandId], [type]: [...prev[brandId][type], { quantity: 1, recipientName: '' }] }
    }))
  }

  const updateException = (brandId: number, type: 'mrpExceptions' | 'freeExceptions', index: number, field: keyof ExceptionEntry, val: string | number) => {
    setCounts(prev => {
      const list = [...prev[brandId][type]]
      list[index] = { ...list[index], [field]: val }
      return { ...prev, [brandId]: { ...prev[brandId], [type]: list } }
    })
  }

  const removeException = (brandId: number, type: 'mrpExceptions' | 'freeExceptions', index: number) => {
    setCounts(prev => {
      const list = [...prev[brandId][type]]
      list.splice(index, 1)
      return { ...prev, [brandId]: { ...prev[brandId], [type]: list } }
    })
  }

  const handleCloseShift = async () => {
    const confirmClose = confirm("Are you sure you want to CLOSE the shift? This will permanently calculate sales and lock the records.")
    if (!confirmClose) return

    setIsSubmitting(true)
    try {
      // Build payload
      const payload: ShiftCloseData[] = Object.keys(counts).map(id => {
        const data = counts[Number(id)]
        return {
          brandId: Number(id),
          physicalClosingBottles: Number(data.physicalClosingBottles) || 0,
          mrpExceptions: data.mrpExceptions.filter(e => e.quantity > 0 && e.recipientName),
          freeExceptions: data.freeExceptions.filter(e => e.quantity > 0 && e.recipientName),
        }
      })
      await closeDailyShift(payload)
      alert("Shift Successfully Closed! Reports updated.")
      window.location.reload()
    } catch (e: any) {
      alert("Error closing shift.")
    }
    setIsSubmitting(false)
  }

  if (inventory.length === 0) {
    return <div className="text-zinc-500 py-20 text-center border border-dashed border-zinc-800 rounded-2xl">No bottles present at the counter yet.</div>
  }

  return (
    <div className="space-y-6">
      
      {inventory.map(item => {
        const data = counts[item.brandId]
        return (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* CURRENT TALLY */}
              <div className="md:col-span-1 border-r border-zinc-800 pr-6">
                <h3 className="text-2xl font-bold text-white mb-4">{item.brand.name}</h3>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-black text-amber-500 tracking-tighter">{item.bottles}</span>
                  <span className="text-zinc-500 font-medium pb-1 uppercase tracking-widest text-sm">Est. Bottles</span>
                </div>
                <p className="text-xs text-zinc-500">System thinks there are {item.bottles} bottles currently at the bar.</p>
              </div>

              {/* CLOSING ENTRY */}
              <div className="md:col-span-1 border-r border-zinc-800 pr-6">
                <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-3">Physical End Count</label>
                <input 
                  type="number" min="0" placeholder="Actual count..." 
                  value={data.physicalClosingBottles}
                  onChange={e => handleBottleChange(item.brandId, e.target.value)}
                  className="w-full text-2xl font-black bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:font-normal placeholder:text-base" 
                />
              </div>

              {/* EXCEPTIONS LEDGER */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-widest"><ShieldAlert className="inline w-4 h-4 mr-2 mb-1"/>Exception Ledger</label>
                  <div className="flex gap-2">
                    <button onClick={() => addException(item.brandId, 'mrpExceptions')} className="text-xs bg-blue-500/10 text-blue-400 font-bold px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white transition-all">+ MRP</button>
                    <button onClick={() => addException(item.brandId, 'freeExceptions')} className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1.5 rounded-md hover:bg-emerald-500 hover:text-white transition-all">+ COMP</button>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* MRP */}
                  {data.mrpExceptions.map((ex, idx) => (
                    <div key={`mrp-${idx}`} className="flex gap-2 items-center bg-zinc-950 p-2 rounded-lg border border-blue-900/50">
                      <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2 py-1 rounded">MRP</span>
                      <input type="number" min="1" value={ex.quantity} onChange={e => updateException(item.brandId, 'mrpExceptions', idx, 'quantity', Number(e.target.value))} className="w-16 bg-transparent border-b border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500 px-1" />
                      <span className="text-zinc-500 text-xs">btls to</span>
                      <input type="text" placeholder="e.g. Room 204" value={ex.recipientName} onChange={e => updateException(item.brandId, 'mrpExceptions', idx, 'recipientName', e.target.value)} className="flex-1 bg-transparent border-b border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500 px-1" />
                      <button onClick={() => removeException(item.brandId, 'mrpExceptions', idx)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}

                  {/* FREE */}
                  {data.freeExceptions.map((ex, idx) => (
                    <div key={`free-${idx}`} className="flex gap-2 items-center bg-zinc-950 p-2 rounded-lg border border-emerald-900/50">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded">COMP</span>
                      <input type="number" min="1" value={ex.quantity} onChange={e => updateException(item.brandId, 'freeExceptions', idx, 'quantity', Number(e.target.value))} className="w-16 bg-transparent border-b border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500 px-1" />
                      <span className="text-zinc-500 text-xs">btls to</span>
                      <input type="text" placeholder="e.g. Staff: John" value={ex.recipientName} onChange={e => updateException(item.brandId, 'freeExceptions', idx, 'recipientName', e.target.value)} className="flex-1 bg-transparent border-b border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500 px-1" />
                      <button onClick={() => removeException(item.brandId, 'freeExceptions', idx)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}

                  {data.mrpExceptions.length === 0 && data.freeExceptions.length === 0 && (
                    <div className="text-zinc-600 text-sm italic">No exceptions logged for this brand today.</div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )
      })}

      <div className="sticky bottom-6 mt-12 bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-between z-50">
        <div>
          <h2 className="text-xl font-bold text-white">Ready to close the bar?</h2>
          <p className="text-zinc-400 text-sm">Make sure physical counts are entered for ALL active brands above.</p>
        </div>
        <button disabled={isSubmitting} onClick={handleCloseShift} className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-lg py-4 px-8 rounded-xl transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center gap-2">
          {isSubmitting ? 'Processing...' : <><CheckCircle className="w-6 h-6"/> EXECUTE SHIFT CLOSE</>}
        </button>
      </div>

    </div>
  )
}
