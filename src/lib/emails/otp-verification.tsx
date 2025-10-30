import { Body, Container, Head, Heading, Html, Img, Preview, Section, Text } from "@react-email/components"


export const OtpVerification = (otp: string) => (
  <Html>
    <Head />
    <Preview>Your verification code: {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your verification code</Heading>
        <Text style={heroText}>Hello, here's your verification code to complete your action:</Text>
        <Section style={otpContainer}>
          <Text style={otpText}>{otp}</Text>
        </Section>
        <Text style={text}>This code will expire in 10 minutes for security reasons.</Text>
        <Text style={text}>
          If you didn't request this code, please ignore this email or contact our support team if you have concerns.
        </Text>
        <Section style={instructionsContainer}>
          <Text style={instructionsTitle}>How to use this code:</Text>
          <Text style={instructionsText}>1. Return to the application or website where you requested the code</Text>
          <Text style={instructionsText}>2. Enter the 8-digit code exactly as shown above</Text>
          <Text style={instructionsText}>3. Complete your verification within 10 minutes</Text>
        </Section>
        <Section style={footerContainer}>
          <Text style={footer}>
            This verification code was requested from your account. If you didn't make this request, please contact our
            support team immediately.
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

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
}

const logo = {
  margin: "0 auto",
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
  textAlign: "center" as const,
}

const otpContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "2px dashed #e9ecef",
}

const otpText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#333",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
}

const text = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
}

const instructionsContainer = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f8f9fa",
  borderRadius: "6px",
}

const instructionsTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
}

const instructionsText = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "4px 0",
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

export default OtpVerification
