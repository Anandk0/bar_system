"use client"

import { useState } from 'react'
import { addStockToGodown, transferToCounter } from '@/app/actions/inventory'
import { PlusCircle, ArrowRightLeft, Package, Boxes } from 'lucide-react'
import type { Prisma } from '@prisma/client'

type Brand = Prisma.BrandGetPayload<{}>
type GodownItem = Prisma.GodownInventoryGetPayload<{ include: { brand: true } }>

export default function GodownClient({ inventory, brands }: { inventory: GodownItem[], brands: Brand[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  async function handleAddStock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsAdding(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addStockToGodown(Number(formData.get('brandId')), Number(formData.get('boxes')))
      e.currentTarget.reset()
    } catch {
      alert("Error adding stock.")
    }
    setIsAdding(false)
  }

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsTransferring(true)
    const formData = new FormData(e.currentTarget)
    try {
      await transferToCounter(Number(formData.get('brandId')), Number(formData.get('boxes')))
      e.currentTarget.reset()
    } catch (err: any) {
      alert(err.message || "Error transferring stock.")
    }
    setIsTransferring(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* INVENTORY GRID */}
      <div className="lg:col-span-2 order-2 lg:order-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inventory.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Boxes className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{item.brand.name}</h3>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-amber-500 tracking-tighter">{item.boxes}</span>
                  <span className="text-zinc-500 font-medium pb-1 uppercase tracking-widest text-sm">Boxes</span>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between text-xs text-zinc-500 font-medium">
                  <span>Contains {item.boxes * item.brand.bottlesPerBox} Bottles Total</span>
                </div>
              </div>
            </div>
          ))}
          {inventory.length === 0 && (
            <div className="col-span-2 text-zinc-500 py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
              No inventory tracked. Add a brand in settings first.
            </div>
          )}
        </div>
      </div>

      {/* ACTION PANELS */}
      <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
        
        {/* RECEIVE STOCK */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
            <PlusCircle className="w-5 h-5"/> Receive Supplier Delivery
          </h2>
          <form onSubmit={handleAddStock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Brand</label>
              <select required name="brandId" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                <option value="">Select Brand...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Boxes Received</label>
              <input required name="boxes" type="number" min="1" placeholder="Number of boxes" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <button disabled={isAdding} type="submit" className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-emerald-950 font-bold py-3 px-4 rounded-xl transition-all">
              {isAdding ? 'Processing...' : 'Add to Godown'}
            </button>
          </form>
        </div>

        {/* TRANSFER TO COUNTER */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-blue-400 mb-6 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5"/> Transfer to Counter
          </h2>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Brand</label>
              <select required name="brandId" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                <option value="">Select Brand...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Boxes to Transfer</label>
              <input required name="boxes" type="number" min="1" placeholder="Quantity to move" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <button disabled={isTransferring} type="submit" className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-blue-950 font-bold py-3 px-4 rounded-xl transition-all">
              {isTransferring ? 'Moving...' : 'Move to Bar'}
            </button>
          </form>
        </div>

      </div>

    </div>
  )
}
