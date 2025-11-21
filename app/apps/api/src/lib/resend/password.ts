import { resend } from ".";
import EmailVerification from "@packages/emails/email-verification";
import OtpVerification from "@packages/emails/otp-verification";
import type { User } from "better-auth";
import PasswordReset from "@packages/emails/password-reset";

export const verificationEmail = async (user: User, url: string)=> {
  const {data, error} = await resend.emails.send({
    from: `support@${process.env.RESEND_DOMAIN_ADDRESS}`,
    to: user.email,
    subject: "Verify your Email Address!",
    react: EmailVerification(user.name, url)
  })
  return data
}

export const otpEmail = async (email: string, otp: string) => {
  const {data, error} = await resend.emails.send({
    from: `support@${process.env.RESEND_DOMAIN_ADDRESS}`,
    to: email,
    subject: "Verify your Email Address!",
    react: OtpVerification(otp)
  })
  return data
}

export const resetPassword = async (email: string, url: string) => {
  const {data, error} = await resend.emails.send({
    from: `support@${process.env.RESEND_DOMAIN_ADDRESS}`,
    to: email,
    subject: "Verify your Email Address!",
    react: PasswordReset(url)
  })
  return data
}