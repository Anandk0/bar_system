"use client"

import { useState } from 'react'
import { createBrand, deleteBrand } from '@/app/actions/brands'
import { Plus, Trash2, Package, DollarSign, Wine } from 'lucide-react'
import type { Prisma } from '@prisma/client'

type Brand = Prisma.BrandGetPayload<{}>

export default function SettingsClient({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState(initialBrands)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAddBrand(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const data = {
        name: formData.get('name') as string,
        bottlesPerBox: Number(formData.get('bottlesPerBox')),
        standardPrice: Number(formData.get('standardPrice')),
        mrpPrice: Number(formData.get('mrpPrice')),
        boxPrice: Number(formData.get('boxPrice')),
      }
      const newBrand = await createBrand(data)
      setBrands([...brands, newBrand].sort((a, b) => a.name.localeCompare(b.name)))
      e.currentTarget.reset()
    } catch (err) {
      alert("Failed to create brand. Name might already exist.")
    }
    setIsSubmitting(false)
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure? This will delete all associated inventory and shift data if cascading is enabled.")) return
    await deleteBrand(id)
    setBrands(brands.filter(b => b.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ADD BRAND FORM */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Add New Brand
          </h2>
          <form onSubmit={handleAddBrand} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Brand Name</label>
              <input required name="name" type="text" placeholder="e.g. Jack Daniels" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5"><Package className="inline w-3 h-3 mr-1"/>Bottles / Box</label>
                <input required name="bottlesPerBox" type="number" min="1" placeholder="12" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5"><DollarSign className="inline w-3 h-3 mr-1"/>Box Price</label>
                <input required name="boxPrice" type="number" step="0.01" min="0" placeholder="100" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5"><DollarSign className="inline w-3 h-3 mr-1"/>Std Price / Btl</label>
                <input required name="standardPrice" type="number" step="0.01" min="0" placeholder="10" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5"><DollarSign className="inline w-3 h-3 mr-1"/>MRP / Btl</label>
                <input required name="mrpPrice" type="number" step="0.01" min="0" placeholder="8" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-all" />
              </div>
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Brand'}
            </button>
          </form>
        </div>
      </div>

      {/* BRAND LIST */}
      <div className="lg:col-span-2 space-y-4">
        {brands.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-20 border border-dashed border-zinc-800 rounded-2xl">
            <Wine className="w-12 h-12 mb-4 opacity-50"/>
            <p>No brands configured yet.</p>
          </div>
        ) : (
          brands.map(brand => (
            <div key={brand.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 flex items-center justify-between transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 text-amber-500">
                  <Wine className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{brand.name}</h3>
                  <div className="flex gap-4 text-sm font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5"><Package className="w-4 h-4 text-zinc-500"/> {brand.bottlesPerBox} / box</span>
                    <span className="flex items-center gap-1.5 text-emerald-400"><DollarSign className="w-4 h-4"/> Std: {brand.standardPrice}</span>
                    <span className="flex items-center gap-1.5 text-blue-400"><DollarSign className="w-4 h-4"/> MRP: {brand.mrpPrice}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => handleDelete(brand.id)} className="relative z-10 p-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                <Trash2 className="w-5 h-5"/>
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
