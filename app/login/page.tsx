"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleProviderLogin = (provider: string) => {
    // TODO: Add OAuth login flow for each provider
    console.log(`Login with ${provider}`);
    router.push("/");
  };

  const handleEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Add email/password authentication logic
    console.log("Login with email", { email, password });
    router.push("/");
  };

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
              <button
                type="button"
                onClick={() => handleProviderLogin("Google")}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900">
                  G
                </span>
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={() => handleProviderLogin("Microsoft")}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f3f3f3] text-slate-900">
                  M
                </span>
                Sign in with Microsoft
              </button>

              <button
                type="button"
                onClick={() => handleProviderLogin("Yahoo")}
                className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-[#410093] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#330074]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#410093]">
                  Y
                </span>
                Sign in with Yahoo
              </button>
            </div>

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
