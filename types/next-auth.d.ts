import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface DefaultUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }

  interface Session {
    user: DefaultUser
  }

  export interface User extends DefaultUser {}
}
