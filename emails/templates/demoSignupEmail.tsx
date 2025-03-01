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

interface DemoSignupEmailProps {
  name: string;
  demoDate: string;
  demoTime: string;
  timezone: string;
  meetingLink: string;
  calendarLink: string;
}

export const DemoSignupEmail = ({
  name,
  demoDate,
  demoTime,
  timezone,
  meetingLink,
  calendarLink,
}: DemoSignupEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your DevMechDX Demo is Confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Demo is Scheduled</Heading>
          <Text style={text}>
            Hi {name},
          </Text>
          <Text style={text}>
            Thank you for scheduling a demo of DevMechDX! We're excited to show you how our platform can help streamline your development workflow.
          </Text>
          <Section style={detailsContainer}>
            <Text style={detailsHeading}>Demo Details:</Text>
            <Text style={detailsText}>
              Date: {demoDate}<br />
              Time: {demoTime} ({timezone})<br />
              Duration: 45 minutes
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={meetingLink}>
              Join Meeting
            </Button>
          </Section>
          <Section style={buttonContainer}>
            <Button style={calendarButton} href={calendarLink}>
              Add to Calendar
            </Button>
          </Section>
          <Text style={text}>
            What we'll cover in the demo:
          </Text>
          <ul style={list}>
            <li style={listItem}>Platform overview and key features</li>
            <li style={listItem}>Development workflow optimization</li>
            <li style={listItem}>Team collaboration tools</li>
            <li style={listItem}>Integration capabilities</li>
            <li style={listItem}>Q&A session</li>
          </ul>
          <Text style={text}>
            To make the most of our session, please:
          </Text>
          <ul style={list}>
            <li style={listItem}>Test your audio/video before the call</li>
            <li style={listItem}>Prepare any specific questions</li>
            <li style={listItem}>Have your team's requirements in mind</li>
          </ul>
          <Text style={text}>
            Need to reschedule? Reply to this email and we'll help you find a better time.
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

const detailsContainer = {
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  margin: "24px 0",
  padding: "16px",
};

const detailsHeading = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const detailsText = {
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

const calendarButton = {
  backgroundColor: "#ffffff",
  border: "1px solid #5469d4",
  borderRadius: "4px",
  color: "#5469d4",
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

export default DemoSignupEmail; 