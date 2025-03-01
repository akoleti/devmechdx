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

interface MagicLinkEmailProps {
  magicLink: string;
  expiresInMinutes: number;
}

export const MagicLinkEmail = ({
  magicLink,
  expiresInMinutes,
}: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your DevMechDX login link</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Login to DevMechDX</Heading>
          <Text style={text}>
            Click the button below to securely log in to your DevMechDX account. This link will expire in {expiresInMinutes} minutes.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Login to DevMechDX
            </Button>
          </Section>
          <Text style={text}>
            If you didn't request this login link, you can safely ignore this email.
          </Text>
          <Text style={securityNote}>
            For security reasons, this link can only be used once and expires in {expiresInMinutes} minutes.
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

export default MagicLinkEmail; 