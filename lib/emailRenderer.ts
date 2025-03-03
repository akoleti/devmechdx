import { render } from "@react-email/render";
import { convert } from "html-to-text";

// Import all email templates
import InviteUserEmail from "@/emails/templates/inviteUser";
import WelcomeEmail from "@/emails/templates/welcomeEmail";
import VerificationEmail from "@/emails/templates/verificationEmail";
import MagicLinkEmail from "@/emails/templates/magicLinkEmail";
import ForgotPasswordEmail from "@/emails/templates/forgotPasswordEmail";
import OrganizationInviteEmail from "@/emails/templates/organizationInviteEmail";
import NewMemberAddedEmail from "@/emails/templates/newMemberAddedEmail";
import MemberDeactivatedEmail from "@/emails/templates/memberDeactivatedEmail";
import DemoSignupEmail from "@/emails/templates/demoSignupEmail";
import PlanSignupEmail from "@/emails/templates/planSignupEmail";

export type EmailTemplate = {
  subject: string;
  htmlBody: string;
  textBody: string;
};

export async function renderEmailTemplate(
  templateName: string,
  props: any
): Promise<EmailTemplate> {
  let component;
  let subject = "";

  switch (templateName) {
    case "inviteUser":
      component = InviteUserEmail(props);
      subject = `Join ${props.organizationName} on DevMechDX`;
      break;
    case "welcome":
      component = WelcomeEmail(props);
      subject = "Welcome to DevMechDX!";
      break;
    case "verification":
      component = VerificationEmail(props);
      subject = "Verify your email address";
      break;
    case "magicLink":
      component = MagicLinkEmail(props);
      subject = "Your DevMechDX login link";
      break;
    case "forgotPassword":
      component = ForgotPasswordEmail(props);
      subject = "Reset your DevMechDX password";
      break;
    case "organizationInvite":
      component = OrganizationInviteEmail(props);
      subject = `Join ${props.organizationName} on DevMechDX`;
      break;
    case "newMemberAdded":
      component = NewMemberAddedEmail(props);
      subject = `New team member added to ${props.organizationName}`;
      break;
    case "memberDeactivated":
      component = MemberDeactivatedEmail(props);
      subject = `Team member deactivated from ${props.organizationName}`;
      break;
    case "demoSignup":
      component = DemoSignupEmail(props);
      subject = "Your DevMechDX Demo is Confirmed!";
      break;
    case "planSignup":
      component = PlanSignupEmail(props);
      subject = `Welcome to DevMechDX ${props.planName} Plan!`;
      break;
    default:
      throw new Error(`Unknown email template: ${templateName}`);
  }

  const html = await render(component);
  const text = convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
      { selector: 'img', format: 'skip' },
    ],
  });

  return {
    subject,
    htmlBody: html,
    textBody: text,
  };
} 