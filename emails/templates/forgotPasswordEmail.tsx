import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordEmailProps {
  resetLink: string;
  expiresInMinutes: number;
}

export const ForgotPasswordEmail = ({
  resetLink,
  expiresInMinutes,
}: ForgotPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your DevMechDX password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            We received a request to reset your DevMechDX account password. Click the button below to choose a new password:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </Text>
          <Text style={securityNote}>
            For security reasons, this password reset link will expire in {expiresInMinutes} minutes.
          </Text>
          <Text style={footer}>
            Best regards,<br />
            The DevMechDX Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  margin: "24px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const securityNote = {
  backgroundColor: "#fff8e1",
  borderRadius: "4px",
  color: "#856404",
  fontSize: "14px",
  margin: "24px 0",
  padding: "12px 16px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "48px 0 0",
};

export default ForgotPasswordEmail; 