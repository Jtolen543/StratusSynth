"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export const SocialSigninForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>("")
  const signinWithSocial = async (provider: "google" | "github" | "discord") => {
    setLoading(true)
    setSelected(provider)
    setTimeout(() => {
      toast.info("Loading")
    }, 2500)
    await authClient.signIn.social({
      provider,
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.success(`Attempting to sign up with ${provider}`)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    })
    setLoading(false)
  }

  return (
    <div className="flex gap-4 pb-4 w-full justify-center flex-wrap">
      <Button 
        className={`flex gap-4 w-[150px] ${loading ? "bg-muted cursor-not-allowed hover:bg-muted" : ""}`} 
        onClick={() => signinWithSocial("google")}
        disabled={loading}
      >
        {selected === "google" ?
          <Loader2 className="animate-spin text-primary"/>
          :
          <>
            <FontAwesomeIcon icon={faGoogle}size="xl" />
            <div>Google</div>
          </>
        }
      </Button>
      <Button 
        className={`flex gap-4 w-[150px] ${loading ? "bg-muted cursor-not-allowed hover:bg-muted" : ""}`} 
        onClick={() => signinWithSocial("github")}
        disabled={loading}
      >
        {selected === "github" ?
          <Loader2 className="animate-spin text-primary"/>
          :
          <>
            <FontAwesomeIcon icon={faGithub}size="xl" />
            <div>GitHub</div>
          </>
        }
      </Button>
      <Button 
        className={`flex gap-4 w-[150px] ${loading ? "bg-muted cursor-not-allowed hover:bg-muted" : ""}`} 
        onClick={() => signinWithSocial("discord")}
        disabled={loading}
      >
        {selected === "discord" ?
          <Loader2 className="animate-spin text-primary"/>
          :
          <>
            <FontAwesomeIcon icon={faDiscord}size="xl" />
            <div>Discord</div>
          </>
        }
      </Button>
    </div>
    
  )
}