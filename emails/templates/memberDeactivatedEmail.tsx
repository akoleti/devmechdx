import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MemberDeactivatedEmailProps {
  memberName: string;
  organizationName: string;
  deactivatedByName: string;
  reason?: string;
}

export const MemberDeactivatedEmail = ({
  memberName,
  organizationName,
  deactivatedByName,
  reason,
}: MemberDeactivatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Team member deactivated from {organizationName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Team Member Deactivated</Heading>
          <Text style={text}>
            {deactivatedByName} has deactivated {memberName}'s access to {organizationName}.
          </Text>
          {reason && (
            <Text style={text}>
              Reason for deactivation: {reason}
            </Text>
          )}
          <Text style={text}>
            The following access has been revoked:
          </Text>
          <ul style={list}>
            <li style={listItem}>Team projects and resources</li>
            <li style={listItem}>Collaboration tools</li>
            <li style={listItem}>Team settings</li>
            <li style={listItem}>Team communication channels</li>
          </ul>
          <Text style={securityNote}>
            All active sessions for this user have been terminated, and their access tokens have been revoked.
          </Text>
          <Text style={text}>
            If this was done by mistake or you need to restore access, please contact your organization administrator.
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
    color: "#dc3545",
  },
};

const securityNote = {
  backgroundColor: "#f8d7da",
  borderRadius: "4px",
  color: "#721c24",
  fontSize: "14px",
  margin: "24px 0",
  padding: "12px 16px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "48px 0 0",
};

export default MemberDeactivatedEmail; 