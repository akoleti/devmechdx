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
  Hr,
} from "@react-email/components";
import * as React from "react";

interface DemoRequestNotificationProps {
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  numberOfEmployees: number;
  additionalInfo?: string;
}

export default function DemoRequestNotification({
  name,
  email,
  phone,
  organizationName,
  numberOfEmployees,
  additionalInfo,
}: DemoRequestNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New Demo Request: {organizationName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Demo Request</Heading>
          <Section style={section}>
            <Text style={text}>
              You have received a new demo request from {name} at {organizationName}.
            </Text>
            
            <Hr style={hr} />
            
            <Heading as="h2" style={h2}>Contact Information</Heading>
            <Text style={infoText}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={infoText}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={infoText}>
              <strong>Phone:</strong> {phone || "Not provided"}
            </Text>
            <Text style={infoText}>
              <strong>Organization:</strong> {organizationName}
            </Text>
            <Text style={infoText}>
              <strong>Number of Employees:</strong> {numberOfEmployees || "Not specified"}
            </Text>
            
            {additionalInfo && (
              <>
                <Heading as="h2" style={h2}>Additional Information</Heading>
                <Text style={infoText}>{additionalInfo}</Text>
              </>
            )}
            
            <Hr style={hr} />
            
            <Text style={text}>
              Please contact this lead within 24 hours to schedule their demo.
            </Text>
            
            <Button
              style={button}
              href={`mailto:${email}?subject=DevMechDX%20Demo%20Request&body=Hello%20${encodeURIComponent(name)},%0A%0AThank%20you%20for%20your%20interest%20in%20DevMechDX.%20I'd%20like%20to%20schedule%20a%20demo%20for%20you.%0A%0ABest%20regards,%0ADevMechDX%20Team`}
            >
              Reply to Request
            </Button>
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
  marginBottom: "20px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "15px",
  marginTop: "25px",
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

const infoText = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "22px",
  marginBottom: "10px",
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

const hr = {
  borderTop: "1px solid #e0e0e0",
  margin: "25px 0",
}; 