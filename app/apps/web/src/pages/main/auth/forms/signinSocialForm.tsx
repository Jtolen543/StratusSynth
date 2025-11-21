import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGoogle, faGithub, faMicrosoft } from "@fortawesome/free-brands-svg-icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { authClient } from "@/lib/authentication/auth-client"
import { Loader2 } from "lucide-react"
import { config } from "@/config"

export const SocialSigninForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>("")

  const signinWithSocial = async (provider: string, display: string) => {
    setLoading(true)
    setSelected(provider)
    await authClient.signIn.social({
      provider,
      callbackURL: config.baseURL,
      fetchOptions: {
        onSuccess: () => {
          toast.success(`Attempting to sign up with ${display}`)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    })
    setLoading(false)
  }

  const socialsList = [
    {provider: "Google", value: "google", icon: faGoogle},
    {provider: "Github", value: "github", icon: faGithub},
    {provider: "Discord", value: "discord", icon: faDiscord},
    {provider: "Microsoft", value: "microsoft", icon: faMicrosoft}
  ]

  return (
    <div className="flex gap-4 pb-4 w-full justify-center flex-wrap">
      {socialsList.map((social) => (
        <Button 
          className={`flex gap-4 w-[150px] ${loading ? "bg-muted cursor-not-allowed hover:bg-muted" : ""}`} 
          onClick={() => signinWithSocial(social.value, social.provider)}
          disabled={loading}
        >
          {selected === social.value ?
            <Loader2 className="animate-spin text-primary"/>
            :
            <>
              <FontAwesomeIcon icon={social.icon}size="xl" />
              <div>{social.provider}</div>
            </>
          }
        </Button>
      ))}
    </div>
    
  )
}