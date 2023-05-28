import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from '@/utils/database'
import User from '@/models/user'
import { User as NextUser } from 'next-auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      const sessionUser = await User.findOne({ email: session.user!.email })

      session.user.id = sessionUser._id.toString()
      return session
    },
    signIn: async ({ user }: { user: NextUser }) => {
      try {
        await connectToDB()
        const userExists = await User.findOne({ email: user.email })

        if (!userExists) {
          await User.create({
            email: user.email,
            username: user.name!.replace(' ', '').toLowerCase(),
            image: user.image!,
          })
        }
        return true
      } catch (err) {
        console.log('error:', err)
        return false
      }
    },
  },
})

export { handler as GET, handler as POST }
