import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amtrana Bar Inventory',
  description: 'Premium Inventory Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 flex h-screen overflow-hidden antialiased`}>
        <Navigation />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </body>
    </html>
  )
}
