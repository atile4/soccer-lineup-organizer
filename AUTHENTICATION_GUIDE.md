# Authentication Implementation Guide

This guide provides detailed implementation examples for adding authentication to your Soccer Lineup Organizer.

## Table of Contents
1. [NextAuth.js Implementation (Recommended)](#1-nextauthjs-implementation)
2. [Clerk Implementation](#2-clerk-implementation)
3. [Auth0 Implementation](#3-auth0-implementation)
4. [AWS Cognito Implementation](#4-aws-cognito-implementation)
5. [Firebase Authentication](#5-firebase-authentication)
6. [Supabase Auth](#6-supabase-auth)

---

## 1. NextAuth.js Implementation

### Installation
```bash
npm install next-auth
```

### Step 1: Create API Route
Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic here to validate credentials
        // Return user object if valid, null if not
        if (credentials?.email && credentials?.password) {
          // TODO: Validate against your database
          return {
            id: "1",
            name: "User",
            email: credentials.email,
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    // ... existing JSX with form
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg mb-3"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-lg mb-4"
      />
      <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg">
        Sign In
      </button>
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white border py-3 rounded-lg mt-3"
      >
        Sign in with Google
      </button>
    </form>
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    // ... existing JSX
    // Update user menu:
    <button onClick={handleLogout}>
      <span>{session?.user?.name || session?.user?.email}</span>
    </button>
  )
}
```

### Step 4: Add Session Provider
Update `app/layout.tsx`:

```typescript
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### Step 5: Environment Variables
Create `.env.local`:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

---

## 2. Clerk Implementation

### Installation
```bash
npm install @clerk/nextjs
```

### Step 1: Wrap App with Provider
Update `app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        routing="path"
        path="/"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) redirect('/')

  return (
    // ... existing JSX
    // Update user menu:
    <div className="flex items-center space-x-3">
      <span>{user.firstName || user.emailAddresses[0].emailAddress}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
```

### Step 4: Environment Variables
Create `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

---

## 3. Auth0 Implementation

### Installation
```bash
npm install @auth0/nextjs-auth0
```

### Step 1: Create API Route
Create `app/api/auth/[auth0]/route.ts`:

```typescript
import { handleAuth } from '@auth0/nextjs-auth0'

export const GET = handleAuth()
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
'use client'

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  return (
    // ... existing JSX
    <button onClick={handleLogin} className="w-full bg-primary text-white py-3 rounded-lg">
      Sign In
    </button>
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function DashboardPage() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (!user) {
    window.location.href = '/api/auth/login'
    return null
  }

  const handleLogout = () => {
    window.location.href = '/api/auth/logout'
  }

  return (
    // ... existing JSX
    // Update user menu:
    <button onClick={handleLogout}>
      <span>{user.name || user.email}</span>
    </button>
  )
}
```

### Step 4: Wrap App with Provider
Update `app/layout.tsx`:

```typescript
import { UserProvider } from '@auth0/nextjs-auth0/client'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
```

### Step 5: Environment Variables
Create `.env.local`:

```
AUTH0_SECRET=your_random_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
```

---

## 4. AWS Cognito Implementation

### Installation
```bash
npm install aws-amplify @aws-amplify/ui-react
```

### Step 1: Configure Amplify
Create `app/amplify-config.ts`:

```typescript
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
    }
  }
})
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import { useRouter } from 'next/navigation'
import '@aws-amplify/ui-react/styles.css'
import './amplify-config'

export default function LoginPage() {
  const router = useRouter()

  return (
    <Authenticator>
      {({ signOut, user }) => {
        if (user) {
          router.push('/dashboard')
        }
        return null
      }}
    </Authenticator>
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import { signOut } from 'aws-amplify/auth'

export default function DashboardPage() {
  return (
    <Authenticator>
      {({ user }) => (
        // ... existing JSX
        // Update user menu:
        <button onClick={() => signOut()}>
          <span>{user?.signInDetails?.loginId}</span>
        </button>
      )}
    </Authenticator>
  )
}
```

---

## 5. Firebase Authentication

### Installation
```bash
npm install firebase
```

### Step 1: Initialize Firebase
Create `app/firebase-config.ts`:

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
'use client'

import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from './firebase-config'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    // ... form JSX
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase-config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        router.push('/')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) return <div>Loading...</div>

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    // ... existing JSX
    // Update user menu:
    <button onClick={handleLogout}>
      <span>{user?.email}</span>
    </button>
  )
}
```

---

## 6. Supabase Auth

### Installation
```bash
npm install @supabase/supabase-js @supabase/auth-ui-react
```

### Step 1: Create Supabase Client
Create `app/supabase-config.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Step 2: Update Login Page
Update `app/page.tsx`:

```typescript
'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './supabase-config'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <div className="max-w-md mx-auto mt-16">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
      />
    </div>
  )
}
```

### Step 3: Protect Dashboard
Update `app/dashboard/page.tsx`:

```typescript
'use client'

import { supabase } from '../supabase-config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
      } else {
        router.push('/')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    // ... existing JSX
    // Update user menu:
    <button onClick={handleLogout}>
      <span>{user?.email}</span>
    </button>
  )
}
```

---

## Choosing the Right Solution

| Service | Best For | Complexity | Cost |
|---------|----------|------------|------|
| **NextAuth.js** | Most projects, flexibility | Low | Free |
| **Clerk** | Quick setup, great UI | Very Low | Free tier available |
| **Auth0** | Enterprise, compliance | Medium | Free tier available |
| **AWS Cognito** | AWS ecosystem | Medium | Pay per user |
| **Firebase** | Google ecosystem, real-time | Low | Free tier generous |
| **Supabase** | Open-source, full backend | Low | Free tier available |

## Next Steps After Authentication

1. **User-specific data**: Store teams/lineups per user ID
2. **Database integration**: Move from localStorage to a database
3. **Sharing**: Allow coaches to share lineups with assistants
4. **Multi-tenancy**: Support multiple organizations
5. **Role-based access**: Different permissions for coaches/assistants

---

For any questions or issues, refer to the official documentation of your chosen authentication provider.
