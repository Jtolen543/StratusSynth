import { useQuery } from "@tanstack/react-query";
import { clientAPI } from "@/config/api";
import { UserWithRole } from "better-auth/plugins";
import { Session } from "better-auth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useAdminSession() {
  const navigate = useNavigate()
  
  const query = useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {        
      const data = await clientAPI<{user: UserWithRole, session: Session}>({ 
        path: "admin",
        errorHandler: (res) => {
          if (res.status === 401) {
            toast.error("Must be signed in before accessing protected routes")
            navigate("/signin")
          }
          if (!res.ok) {
            toast.error("Unauthorized access")
            navigate("/")
          }
        },
      })

      return data
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000
  })

  return {
    user: query.data?.user,
    session: query.data?.session,
    isLoading: query.isLoading,
    isError:  query.isError,
    error: query.error || "",
    refetch: query.refetch
  }
}