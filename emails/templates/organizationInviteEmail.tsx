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

interface OrganizationInviteEmailProps {
  inviterName: string;
  organizationName: string;
  role: string;
  inviteLink: string;
  expiresInHours: number;
}

export const OrganizationInviteEmail = ({
  inviterName,
  organizationName,
  role,
  inviteLink,
  expiresInHours,
}: OrganizationInviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Join {organizationName} on DevMechDX</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Join {organizationName}</Heading>
          <Text style={text}>
            {inviterName} has invited you to join {organizationName} as a {role.toLowerCase()}.
          </Text>
          <Text style={text}>
            DevMechDX is a platform that helps teams streamline their development workflow and improve collaboration.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={inviteLink}>
              Accept Invitation
            </Button>
          </Section>
          <Text style={text}>
            What you'll be able to do as a {role.toLowerCase()}:
          </Text>
          <ul style={list}>
            <li style={listItem}>Access team projects and resources</li>
            <li style={listItem}>Collaborate with team members</li>
            <li style={listItem}>View and manage team settings</li>
            <li style={listItem}>Participate in team discussions</li>
          </ul>
          <Text style={securityNote}>
            This invitation will expire in {expiresInHours} hours. If you don't want to join {organizationName}, you can ignore this email.
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

export default OrganizationInviteEmail; 