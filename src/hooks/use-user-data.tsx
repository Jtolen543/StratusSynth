"use client"

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Session } from "better-auth";

type DeviceType = "Phone" | "Tablet" | "Desktop" | "Unknown";
type BrowserType = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Brave" | "Unknown";
type SubscriptionType = {
  limits: Record<string, number> | undefined;
  priceId: string | undefined;
  id: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: Date;
  referenceId: string;
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "paused" | "trialing" | "unpaid";
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  groupId?: string;
  seats?: number;
}[]

export function useUserData() {
  function getDeviceType(session: Session): DeviceType {
    const ua = session.userAgent?.toLowerCase() ?? "";
    if (/iphone|android.*mobile|windows phone/.test(ua)) return "Phone";
    if (/ipad|android(?!.*mobile)|tablet|kindle|silk/.test(ua)) return "Tablet";
    if (/windows nt|macintosh|linux x86_64|x11/.test(ua)) return "Desktop";
    return "Unknown";
  }
  function getBrowserType(session: Session): BrowserType {
    const ua = session.userAgent?.toLowerCase() ?? "";

    if (ua.includes("edg/")) return "Edge"; 
    if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
    if (ua.includes("brave")) return "Brave";
    if (ua.includes("chrome/") && !ua.includes("edg/") && !ua.includes("opr/")) return "Chrome";
    if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
    if (ua.includes("firefox/")) return "Firefox";

    return "Unknown";
  }
  const query = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const [accounts, sessions, {data}, passkeys, subscriptionRes] = await Promise.all([
        authClient.listAccounts(),
        authClient.listSessions(),
        authClient.getSession(),
        authClient.passkey.listUserPasskeys(),
        fetch("/api/subscription")
      ]);
      const subscription: SubscriptionType = await subscriptionRes.json()
      const activeSessions = sessions?.data?.map((session) => ({
        ...session, 
        current: session.id === data?.session.id,
        type: getDeviceType(session),
        browser: getBrowserType(session)
      }))
      return {
        accounts: accounts, 
        sessions: activeSessions, 
        user: data?.user, 
        passkeys: passkeys.data, 
        subscription: subscription ? subscription[0] : null
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000
  });

  return {
    accounts: query.data?.accounts.data ?? [],
    sessions: query.data?.sessions ?? [],
    user: query.data?.user ?? null,
    passkeys: query.data?.passkeys ?? [],
    subscription: query.data?.subscription,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export type UserData = ReturnType<typeof useUserData>
