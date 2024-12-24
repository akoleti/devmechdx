import WelcomeEmail from '@/emails/WelcomeEmail';
import { Resend } from 'resend';
import '@types/resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, name, plan, trialDays } = await request.json();

  try {
    await resend.emails.send({
      from: 'MechDX <welcome@mechdx.com>',
      to: email,
      subject: `Welcome to MechDX ${plan} Trial!`,
      react: WelcomeEmail({
        name,
        plan,
        trialDays,
        verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${generateToken(email)}`
      })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 