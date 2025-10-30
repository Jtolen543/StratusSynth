"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form"

export const PasswordSignInForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formSchema = z.object({
    email: z.email({error: "Invalid email fomat"}),
    password: z.string().min(8, {error: "Must be at least 8 characters"})
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    if (!PublicKeyCredential.isConditionalMediationAvailable ||
        !PublicKeyCredential.isConditionalMediationAvailable()) {
      return;
    }
    void authClient.signIn.passkey({ 
      autoFill: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged in")
          router.push("/")
        },
        onError: () => {
          toast.error("Failed to log in with passkey")
        }
      } 
    })
  }, [])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: async (ctx) => {
            console.log(ctx)
            if (ctx.data.twoFactorRedirect) {
              await authClient.twoFactor.sendOtp()
              toast.info("Redirecting to OTP")
              return
            }
            toast.success("Successfully signed in")
            router.push("/")
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          }
        }
      })
      setLoading(false)
  }
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="py-4 flex flex-col gap-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email..." {...field} autoComplete="username webauthn"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password..." {...field} autoComplete="current-password webauthn"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : "Add"}</Button>
        </form>
      </Form>
    )
}