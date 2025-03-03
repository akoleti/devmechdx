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

interface VerificationEmailProps {
  verificationCode: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  verificationCode,
  verificationLink,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>
            Thanks for signing up for DevMechDX! Please verify your email address by clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationLink}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            Or enter this verification code:
          </Text>
          <Text style={codeContainer}>
            {verificationCode}
          </Text>
          <Text style={text}>
            This code will expire in 1 hour. If you didn't request this verification, you can safely ignore this email.
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

const codeContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  color: "#333",
  fontSize: "24px",
  fontFamily: "monospace",
  letterSpacing: "4px",
  margin: "16px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "48px 0 0",
};

export default VerificationEmail; 