import { currentCounterInventory } from '@/app/actions/shifts'
import CounterClient from './CounterClient'

export default async function CounterPage() {
  const inventory = await currentCounterInventory()
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Bar Counter</h1>
          <p className="text-zinc-400">Track physical bottles, log complimentary drinks, and close your shift securely.</p>
        </div>
      </div>
      <CounterClient inventory={inventory} />
    </div>
  )
}
