import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  plan: string;
  trialDays: number;
  verificationLink: string;
}

export default function WelcomeEmail({
  name,
  plan,
  trialDays,
  verificationLink,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to MechDX - Verify your email to get started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to MechDX!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thanks for starting your {trialDays}-day {plan} trial. We're excited to have you on board!
          </Text>
          <Text style={text}>
            To get started, please verify your email address by clicking the button below:
          </Text>
          <Link href={verificationLink} style={button}>
            Verify Email Address
          </Link>
          <Text style={text}>
            Once verified, you'll have full access to all {plan} features for the next {trialDays} days.
          </Text>
          <Text style={text}>
            Need help getting started? Check out our:
          </Text>
          <ul>
            <li>Quick Start Guide</li>
            <li>Video Tutorials</li>
            <li>Documentation</li>
          </ul>
          <Text style={text}>
            If you have any questions, our support team is here to help!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const button = {
  backgroundColor: '#0F62FE',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '42px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
  marginBottom: '16px',
}; 