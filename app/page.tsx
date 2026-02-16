'use client'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  // TODO: AUTHENTICATION POINT #1
  // Replace this function with your authentication logic
  // Example services you can use:
  // - NextAuth.js (Auth.js) - Popular, supports multiple providers
  // - Clerk - Complete authentication solution
  // - Auth0 - Enterprise-grade authentication
  // - AWS Cognito - AWS native authentication
  // - Firebase Authentication - Google's authentication service
  // - Supabase Auth - Open-source Firebase alternative
  const handleGuestLogin = () => {
    // TODO: Replace with actual authentication
    // For now, just navigate to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 0 0 20" />
              <path d="M12 2a10 10 0 0 1 0 20" />
              <path d="M2 12h20" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Soccer Lineup</h1>
          <p className="text-gray-600 mt-2">Organize your team with ease</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>
          
          {/* TODO: AUTHENTICATION POINT #2 */}
          {/* Add your login form here with email/password fields */}
          {/* Example structure:
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign In</button>
          </form>
          */}
          
          <div className="space-y-4">
            <button
              onClick={handleGuestLogin}
              className="w-full bg-primary hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Continue as Guest</span>
            </button>

            {/* TODO: AUTHENTICATION POINT #3 */}
            {/* Add social login buttons here if needed */}
            {/* Example: Google, Facebook, Apple sign-in buttons */}
            {/*
            <button onClick={handleGoogleLogin}>
              Sign in with Google
            </button>
            */}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-primary hover:text-green-700 font-semibold">
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 mt-2">Manage Teams</p>
          </div>
          <div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 mt-2">Create Lineups</p>
          </div>
          <div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 mt-2">Drag & Drop</p>
          </div>
        </div>
      </div>
    </div>
  )
}
