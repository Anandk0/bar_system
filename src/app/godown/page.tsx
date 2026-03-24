import { getGodownInventory } from '@/app/actions/inventory'
import { getBrands } from '@/app/actions/brands'
import GodownClient from './GodownClient'

export default async function GodownPage() {
  const inventory = await getGodownInventory()
  const brands = await getBrands()
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Godown Storage</h1>
          <p className="text-zinc-400">Manage incoming supplier deliveries and transfer boxed stock to the front bar.</p>
        </div>
      </div>
      <GodownClient inventory={inventory} brands={brands} />
    </div>
  )

}
