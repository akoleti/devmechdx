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
  Link,
} from "@react-email/components";
import * as React from "react";

interface DemoRequestConfirmationProps {
  name: string;
  baseUrl: string;
}

export default function DemoRequestConfirmation({
  name,
  baseUrl,
}: DemoRequestConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for requesting a DevMechDX demo!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Demo Request Confirmation</Heading>
          <Section style={section}>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thank you for your interest in DevMechDX! We've received your demo request and our team will get back to you within 24 hours to schedule your personalized demonstration.
            </Text>
            <Text style={text}>
              In the meantime, you might want to check out our documentation or case studies to learn more about how DevMechDX can transform your HVAC and chiller management.
            </Text>
            <Button
              style={button}
              href={`${baseUrl}/documentation`}
            >
              View Documentation
            </Button>
            <Text style={footer}>
              If you have any questions, feel free to reply to this email directly. We're here to help!
            </Text>
            <Text style={footer}>
              Best regards,<br />
              The DevMechDX Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Arial, sans-serif",
  padding: "30px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "5px",
  margin: "0 auto",
  padding: "30px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "30px",
  textAlign: "center" as const,
};

const section = {
  marginBottom: "20px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "20px",
};

const button = {
  backgroundColor: "#5e5ef7",
  borderRadius: "4px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "30px auto",
  padding: "12px 20px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "220px",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "20px",
}; 