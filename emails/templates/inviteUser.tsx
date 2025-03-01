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
  Text,
} from "@react-email/components";
import * as React from "react";

interface InviteUserEmailProps {
  inviterName: string;
  organizationName: string;
  inviteLink: string;
}

export const InviteUserEmail = ({
  inviterName,
  organizationName,
  inviteLink,
}: InviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Join {organizationName} on DevMechDX</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You've been invited to join {organizationName}</Heading>
          <Text style={text}>
            Hello,
          </Text>
          <Text style={text}>
            {inviterName} has invited you to join {organizationName} on DevMechDX.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={inviteLink}>
              Join {organizationName}
            </Button>
          </Section>
          <Text style={text}>
            If you don't want to accept this invitation, you can ignore this email.
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

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "48px 0 0",
};

export default InviteUserEmail; 