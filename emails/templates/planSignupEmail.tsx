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

interface PlanSignupEmailProps {
  name: string;
  planName: string;
  planFeatures: string[];
  billingAmount: string;
  billingPeriod: string;
  dashboardUrl: string;
  supportEmail: string;
}

export const PlanSignupEmail = ({
  name,
  planName,
  planFeatures,
  billingAmount,
  billingPeriod,
  dashboardUrl,
  supportEmail,
}: PlanSignupEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DevMechDX {planName} Plan!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {planName}!</Heading>
          <Text style={text}>
            Hi {name},
          </Text>
          <Text style={text}>
            Thank you for choosing DevMechDX {planName} Plan! We're thrilled to have you on board and can't wait to help you optimize your development workflow.
          </Text>
          <Section style={planDetailsContainer}>
            <Text style={planDetailsHeading}>Plan Details:</Text>
            <Text style={planDetailsText}>
              Plan: {planName}<br />
              Billing: {billingAmount} / {billingPeriod}
            </Text>
          </Section>
          <Text style={text}>
            Your plan includes:
          </Text>
          <ul style={list}>
            {planFeatures.map((feature, index) => (
              <li key={index} style={listItem}>{feature}</li>
            ))}
          </ul>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          <Text style={text}>
            Getting Started:
          </Text>
          <ul style={list}>
            <li style={listItem}>Set up your workspace</li>
            <li style={listItem}>Invite team members</li>
            <li style={listItem}>Configure integrations</li>
            <li style={listItem}>Explore features and tutorials</li>
          </ul>
          <Text style={supportNote}>
            Need help getting started? Our support team is here for you at{" "}
            <a href={`mailto:${supportEmail}`} style={link}>
              {supportEmail}
            </a>
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

const planDetailsContainer = {
  backgroundColor: "#f0f9ff",
  borderRadius: "4px",
  margin: "24px 0",
  padding: "16px",
};

const planDetailsHeading = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const planDetailsText = {
  color: "#333",
  fontSize: "16px",
  margin: "0",
  lineHeight: "1.5",
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

const supportNote = {
  backgroundColor: "#e8f5e9",
  borderRadius: "4px",
  color: "#2e7d32",
  fontSize: "14px",
  margin: "24px 0",
  padding: "12px 16px",
};

const link = {
  color: "#2e7d32",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "48px 0 0",
};

export default PlanSignupEmail; 