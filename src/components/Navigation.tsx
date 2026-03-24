"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Wine, ArrowRightLeft, FileBarChart, Settings } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Godown', href: '/godown', icon: Wine },
    { name: 'Counter', href: '/counter', icon: ArrowRightLeft },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <nav className="w-64 bg-zinc-900 border-r border-zinc-800 h-screen p-4 flex flex-col text-zinc-100 shrink-0">
      <div className="text-2xl font-black mb-8 tracking-tighter text-amber-400 flex items-center gap-2">
        <Wine className="w-8 h-8" /> Amtrana Bar
      </div>
      <div className="flex flex-col gap-2">
        {links.map(link => {
          const Icon = link.icon
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
          return (
            <Link key={link.name} href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                ? 'bg-amber-400/10 text-amber-400 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)]'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:translate-x-1'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide uppercase">{link.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
