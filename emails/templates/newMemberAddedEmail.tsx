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

interface NewMemberAddedEmailProps {
  memberName: string;
  organizationName: string;
  role: string;
  addedByName: string;
  dashboardUrl: string;
}

export const NewMemberAddedEmail = ({
  memberName,
  organizationName,
  role,
  addedByName,
  dashboardUrl,
}: NewMemberAddedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New team member added to {organizationName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Team Member Added</Heading>
          <Text style={text}>
            {addedByName} has added {memberName} to {organizationName} as a {role.toLowerCase()}.
          </Text>
          <Text style={text}>
            They will have access to:
          </Text>
          <ul style={list}>
            <li style={listItem}>Team projects and resources</li>
            <li style={listItem}>Collaboration tools</li>
            <li style={listItem}>Team settings (based on role permissions)</li>
            <li style={listItem}>Team communication channels</li>
          </ul>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Team Members
            </Button>
          </Section>
          <Text style={text}>
            You can manage team members and their permissions from your organization settings.
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

export default NewMemberAddedEmail; 