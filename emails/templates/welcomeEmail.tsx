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

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  name,
  dashboardUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DevMechDX - Let's get started!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to DevMechDX!</Heading>
          <Text style={text}>
            Hi {name},
          </Text>
          <Text style={text}>
            We're excited to have you on board! DevMechDX is your all-in-one platform for managing and optimizing your development workflow.
          </Text>
          <Text style={text}>
            Here's what you can do next:
          </Text>
          <ul style={list}>
            <li style={listItem}>Set up your profile and preferences</li>
            <li style={listItem}>Explore our features and tools</li>
            <li style={listItem}>Invite your team members</li>
            <li style={listItem}>Check out our documentation</li>
          </ul>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions, our support team is here to help. Just reply to this email.
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

const list = {
  color: "#333",
  fontSize: "16px",
  listStyleType: "none",
  padding: "0",
  margin: "24px 0",
};

const listItem = {
  margin: "10px 0",
  paddingLeft: "24px",
  position: "relative" as const,
  "::before": {
    content: "•",
    position: "absolute",
    left: "0",
    color: "#5469d4",
  },
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

export default WelcomeEmail; 