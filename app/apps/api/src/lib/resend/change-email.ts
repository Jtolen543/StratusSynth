import { resend } from ".";
import ChangeEmailTemplate from "@packages/emails/change-email";

export const sendChangeEmail = async (email: string, url: string) => {
  const { data, error } = await resend.emails.send({
    from: `support@${process.env.RESEND_DOMAIN_ADDRESS}`,
    to: email,
    subject: "Confirm your new email address",
    react: ChangeEmailTemplate(url),
  })
  if (error) throw error
  return data
}


