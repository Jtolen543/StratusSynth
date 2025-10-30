"use client"

import {z} from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormControl, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function PasswordResetForm({token}: {token: string}) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const formSchema = z.object({
    password: z.string().nonempty({error: "Name cannot be empty"}).min(8, {error: "Must be at least 8 characters long"}),
    confirm: z.string().nonempty({error: "Name cannot be empty"}).min(8, {error: "Must be at least 8 characters long"})
  }).refine((data) => data.password === data.confirm, {
    error: "Passwords must match",
    path: ["confirm"]
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    await authClient.resetPassword({
      newPassword: values.password,
      token: token,
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.info("Successfully reset password")
          router.push("/signin")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        }
      }
    })
    setLoading(false)
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-foreground">Update Password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the new password for your account
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 flex flex-col gap-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter password..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
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
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : "Add"}</Button>
            </form>
          </Form>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

      </CardContent>
    </Card>
  </div>
  )
}