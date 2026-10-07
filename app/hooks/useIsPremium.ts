"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { fetchIsPremium } from "@/services/premium";

export interface UseIsPremium {
  // Whether the user is on the premium table
  isPremium: boolean;
  isLoading: boolean;
  // Resolves to the premium status, running the lookup once per user.
  // Lets a click handler await the answer
  ensureLoaded: () => Promise<boolean>;
}

export function useIsPremium(): UseIsPremium {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // The in-flight (or settled) lookup, keyed to the user it was started for.
  const requestRef = useRef<Promise<boolean> | null>(null);
  // Which user the current `requestRef`/state belongs to, so a slow response
  // from a previous session can't overwrite the current user's status.
  const userIdRef = useRef<string | null>(null);

  const ensureLoaded = useCallback((): Promise<boolean> => {
    if (!userId) return Promise.resolve(false);
    if (requestRef.current) return requestRef.current;

    setIsLoading(true);
    const request = fetchIsPremium(userId)
      .then((result) => {
        if (userIdRef.current === userId) setIsPremium(result);
        return result;
      })
      .catch((err) => {
        // Fail closed — a failed lookup must never unlock the limit.
        console.error("Failed to check premium status:", err);
        if (userIdRef.current === userId) setIsPremium(false);
        return false;
      })
      .finally(() => {
        if (userIdRef.current === userId) setIsLoading(false);
      });

    requestRef.current = request;
    return request;
  }, [userId]);

  // Re-run whenever the signed-in user changes.
  useEffect(() => {
    userIdRef.current = userId;
    requestRef.current = null;
    setIsPremium(false);
    void ensureLoaded();
  }, [userId, ensureLoaded]);

  return { isPremium, isLoading, ensureLoaded };
}

export default useIsPremium;
