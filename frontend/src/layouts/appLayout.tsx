import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="phone-shell bg-aura-gradient">
      {children}
    </div>
  )
}