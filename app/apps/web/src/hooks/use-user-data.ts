"use client"

import { authClient } from "@/lib/authentication/auth-client";
import { getSessionInfo } from "@packages/utils/format"
import { useQuery } from "@tanstack/react-query";

export function useUserData() {
  const query = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const [accounts, sessions, user, passkeys, subscription] = await Promise.all([
        authClient.listAccounts(),
        authClient.listSessions(),
        authClient.getSession(),
        authClient.passkey.listUserPasskeys(),
        authClient.subscription.list()
      ]);
      const activeSessions = sessions?.data?.map((session) => ({
        ...session, 
        current: session.id === user?.data?.session.id,
        ...getSessionInfo(session.userAgent)
      }))
      return {
        accounts: accounts, 
        sessions: activeSessions, 
        user: user.data?.user, 
        passkeys: passkeys.data, 
        subscription: subscription.data ? subscription.data.find((sub) => sub.status === "active") : null
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false
  });

  return {
    accounts: query.data?.accounts.data ?? [],
    sessions: query.data?.sessions ?? [],
    user: query.data?.user ?? null,
    passkeys: query.data?.passkeys ?? [],
    subscription: query.data?.subscription ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export type UserData = ReturnType<typeof useUserData>
