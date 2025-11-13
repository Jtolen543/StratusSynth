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
import { useState } from "react"
import { authClient } from "@/lib/authentication/auth-client"
import { toast } from "sonner"
import { UserData } from "@/hooks/use-user-data"

export function PasskeyForm({data}: {data: UserData}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  
  const formSchema = z.object({
    name: z.string().nonempty({error: "Name cannot be empty"})
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })
  const formSubmit = async ({name}: z.infer<typeof formSchema>) => {
    setLoading(true)
    await authClient.passkey.addPasskey({
      name,
      fetchOptions: {
        onSuccess: async (ctx) => {
          toast.info("Successfully created passkey")
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
    <Dialog onOpenChange={(prev) => setOpen(prev)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FontAwesomeIcon icon={faKey} />
          Add New Passkey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Create New Passkey</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : "Add"}</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}