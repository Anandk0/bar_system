import Link from 'next/link'
import { Wine, ArrowRightLeft, FileBarChart, Settings, Boxes } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col items-center justify-center min-h-[80vh] text-center">
      <Wine className="w-24 h-24 text-amber-500 mb-8 animate-pulse" />
      <h1 className="text-6xl font-black tracking-tighter text-white mb-6">Amtrana Bar System</h1>
      <p className="text-2xl text-zinc-400 mb-16 max-w-2xl font-medium">Inventory and shift management.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <Link href="/godown" className="group bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] shadow-2xl hover:shadow-emerald-500/20">
          <Boxes className="w-12 h-12 text-zinc-500 group-hover:text-emerald-400 mb-4 transition-colors" />
          <h2 className="text-xl font-bold text-white mb-2">Godown</h2>
          <p className="text-zinc-500 text-sm">Receive and manage backroom stock in boxes.</p>
        </Link>

        <Link href="/counter" className="group bg-zinc-900 border border-zinc-800 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] shadow-2xl hover:shadow-blue-500/20">
          <ArrowRightLeft className="w-12 h-12 text-zinc-500 group-hover:text-blue-400 mb-4 transition-colors" />
          <h2 className="text-xl font-bold text-white mb-2">Counter</h2>
          <p className="text-zinc-500 text-sm">Close shifts and log physical bottle counts.</p>
        </Link>

        <Link href="/reports" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] shadow-2xl hover:shadow-amber-500/20">
          <FileBarChart className="w-12 h-12 text-zinc-500 group-hover:text-amber-400 mb-4 transition-colors" />
          <h2 className="text-xl font-bold text-white mb-2">Reports</h2>
          <p className="text-zinc-500 text-sm">View sales, revenue, and exception ledgers.</p>
        </Link>

        <Link href="/settings" className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-500 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] shadow-2xl hover:shadow-white/10">
          <Settings className="w-12 h-12 text-zinc-500 group-hover:text-white mb-4 transition-colors" />
          <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
          <p className="text-zinc-500 text-sm">Configure brands, box sizes, and pricing.</p>
        </Link>
      </div>
    </div>
  )
}
