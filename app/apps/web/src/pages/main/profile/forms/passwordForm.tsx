import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/authentication/auth-client"
import { toast } from "sonner"
import { UserData } from "@/hooks/use-user-data"
import { config } from "@/config"

export function PasswordForm({data}: {data: UserData}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [hasPassword, setHasPassword] = useState<boolean>(data.accounts.some(account => account.providerId === "credential"))

  useEffect(() => {
    setHasPassword(data.accounts.some(account => account.providerId === "credential"))
  }, [data])

  const formSchema = z.object({
    currentPassword: z.string().nonempty({error: "Name cannot be empty"}),
    newPassword: z.string().nonempty({error: "Name cannot be empty"}).min(8, {error: "Must be at least 8 characters long"}),
    confirmPassword: z.string().nonempty({error: "Name cannot be empty"}).min(8, {error: "Must be at least 8 characters long"})
  }).refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords must match",
    path: ["confirmPasword"]
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })
  
  const formSubmit = async ({currentPassword, newPassword}: z.infer<typeof formSchema>) => {
    setLoading(true)
    await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
      fetchOptions: {
        onSuccess: async () => {
          toast.info("Successfully changed password")
          await data.refetch()
          setOpen(false)
        },
        onError: (ctx) => {
          toast.info(ctx.error.message)
        }
      }
    })
    setLoading(false)
  }

  const sendResetLink = async () => {
    setLoading(true)
    await authClient.requestPasswordReset({
      email: data?.user?.email as string,
      redirectTo: `${config.baseURL}/reset-password`,
      fetchOptions: {
        onSuccess: async () => {
          toast.info("Password reset sent to email")
          await data.refetch()
          setOpen(false)
        },
        onError: (ctx) => {
          toast.info(ctx.error.message)
        }
      }
    })
    setLoading(false)
  }

  return (
    <>
      {hasPassword 
        ?
        <Dialog onOpenChange={(prev) => setOpen(prev)} open={open}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FontAwesomeIcon icon={faKey} />
              Modify Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-4">Modify Password</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(formSubmit)}  className="space-y-8">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter password..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter password..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter password..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : "Change Password"}</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        :
        <Button onClick={sendResetLink} variant="outline">
          {loading ? <Loader2 className="animate-spin"/> : "Create New Password"}
        </Button>
      }
    </>
  )
}