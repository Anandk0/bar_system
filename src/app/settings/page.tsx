import { getBrands } from '@/app/actions/brands'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const brands = await getBrands()
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your liquor brands, box configurations, and pricing models.</p>
        </div>
      </div>
      <SettingsClient initialBrands={brands} />
    </div>
  )
}
