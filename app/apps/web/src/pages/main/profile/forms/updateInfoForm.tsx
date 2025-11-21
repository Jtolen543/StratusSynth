import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { UserData } from "@/hooks/use-user-data"
import { Loader2 } from "lucide-react"
import { PasswordForm } from "./passwordForm"
import { authClient } from "@/lib/authentication/auth-client"

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }).max(64),
  lastName: z.string().min(1, { message: "Last name is required" }).max(64),
  email: z.email({ message: "Enter a valid email" }).max(255),
})

export function UpdateInformationForm({ data }: { data: UserData }) {
  const [submitting, setSubmitting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { firstName, lastName } = useMemo(() => {
    const fullName = data?.user?.name ?? ""
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 0) return { firstName: "", lastName: "" }
    if (parts.length === 1) return { firstName: parts[0], lastName: "" }
    return { firstName: parts.slice(0, -1).join(" "), lastName: parts.slice(-1).join(" ") }
  }, [data?.user?.name])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName,
      lastName,
      email: data?.user?.email ?? "",
    },
    values: {
      firstName,
      lastName,
      email: data?.user?.email ?? "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true)
    try {

      await authClient.updateUser({
        name: values.firstName + " " + values.lastName,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully updated user")
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to update user")
          }
        }
      })
      setEditMode(false)
      
      if (values.email && values.email !== data?.user?.email) {
        await authClient.changeEmail({
          newEmail: values.email,
          callbackURL: "/profile"
        })
      }

      await data.refetch()
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} disabled={!editMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} disabled={!editMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} disabled={!editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <PasswordForm data={data}/>
          {!editMode ? (
            <Button type="button" variant="outline" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setEditMode(false)
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}