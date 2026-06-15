"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// TODO: don't make this look vibe coded
export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleProviderLogin = (provider: string) => {
    // TODO: Add OAuth login flow for each provider
    console.log(`Login with ${provider}`);
    router.push("/");
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login with email", { email, password });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  // guard for logged in users
  useEffect(() => {
    if (!loading && user) router.push("/");
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="px-8 pb-10 pt-8">
            <div className="mb-8">
              <h2 className="text-3xl text-center font-semibold text-slate-900">
                Log In
              </h2>
            </div>

            <div className="grid gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleProviderLogin("Microsoft")}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 23 23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                </svg>
                Continue with Microsoft
              </button>

              {/* Yahoo */}
              <button
                type="button"
                onClick={() => handleProviderLogin("Yahoo")}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-[#410093] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#330074]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6h8.4l7.6 12.5L23.6 6H32L16.8 26H13L8 18.8 3.2 26H0V6z"
                    fill="white"
                  />
                  <circle cx="24" cy="26" r="4" fill="white" />
                </svg>
                Continue with Yahoo
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="my-8 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-px flex-1 bg-slate-200"></span>
              <span>or continue with email</span>
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <button
                  type="button"
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Forgot password?
                </button>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Secure
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Sign in with email
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                className="text-primary hover:text-green-700 font-semibold"
                type="button"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
