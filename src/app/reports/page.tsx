import { getShiftHistory } from '@/app/actions/shifts'
import ReportsClient from './ReportsClient'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const history = await getShiftHistory()
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Reports & History</h1>
          <p className="text-zinc-400">View sales performance, variance history, and exception ledgers.</p>
        </div>
      </div>
      <ReportsClient history={history} />
    </div>
  )
}
