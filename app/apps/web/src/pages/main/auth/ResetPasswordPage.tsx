import { useSearchParams } from "react-router"
import { PasswordForgetForm } from "./components/passwordForget"
import { PasswordResetForm } from "./components/passwordReset"

export function ResetPasswordPage() {
  const [searchParams, _] = useSearchParams()
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
