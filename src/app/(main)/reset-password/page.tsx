"use client"

import { useSearchParams } from "next/navigation"
import { PasswordForgetForm } from "./passwordForget"
import { PasswordResetForm } from "./passwordReset"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  return (
    <div>
      {!token ? (
        <PasswordForgetForm />
      ) :  (
        <PasswordResetForm token={token}/>
      )}
    </div>
  )
}
