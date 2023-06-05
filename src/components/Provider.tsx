'use client'
import { SessionProvider } from 'next-auth/react'

type Props = {
  children: React.ReactNode
}

function Provider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}

export default Provider
