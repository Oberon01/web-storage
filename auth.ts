import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const username = credentials.username as string
        const password = credentials.password as string

        // Get admin credentials from environment
        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'

        // Check username
        if (username !== adminUsername) {
          return null
        }

        // Check password - support both plain text (for initial setup) and hashed
        let isValidPassword = false
        
        if (adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')) {
          // Password is hashed
          isValidPassword = await bcrypt.compare(password, adminPassword)
        } else {
          // Password is plain text (for development/initial setup)
          isValidPassword = password === adminPassword
        }

        if (!isValidPassword) {
          return null
        }

        return {
          id: "1",
          name: username,
          email: `${username}@local`,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname === '/login'
      
      if (isOnLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
        return true
      }
      
      return isLoggedIn
    },
  },
})
