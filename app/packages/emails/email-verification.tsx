import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components"



export const EmailVerification = (name: string, url: string) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={heroText}>
          Hi {name}, thanks for signing up! Please verify your email address to complete your account setup.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Verify Email Address
          </Button>
        </Section>
        <Text style={text}>If you didn't create an account, you can safely ignore this email.</Text>
        <Text style={text}>
          Or copy and paste this URL into your browser:{" "}
          <Link href={url} style={link}>
            {url}
          </Link>
        </Text>
        <Section style={footerContainer}>
          <Text style={footer}>
            This email was sent to you because you signed up for an account. If you have any questions, please contact
            our support team.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const heroText = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  color: "#555",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#000000ff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
}

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
}

const link = {
  color: "#007ee6",
  textDecoration: "underline",
}

const footerContainer = {
  marginTop: "48px",
  borderTop: "1px solid #eaeaea",
  paddingTop: "24px",
}

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  textAlign: "center" as const,
}

export default EmailVerification
