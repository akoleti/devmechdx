// This script tests email sending functionality
require('dotenv').config({ path: '.env.local' });

const nodemailer = require('nodemailer');

// Print environment variables for debugging (masking secrets)
console.log('Environment variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Not set');
console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);
console.log('SMTP_FROM_NAME:', process.env.SMTP_FROM_NAME);

// Create test account if no credentials provided
async function main() {
  let testAccount;
  let transporter;
  
  try {
    // Check if we need to create a test account
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('No SMTP credentials found in environment, creating test account...');
      testAccount = await nodemailer.createTestAccount();
      console.log('Test account created:', testAccount.user);
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Using Ethereal test email account');
    } else {
      // Use provided SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      console.log('Using configured SMTP server');
    }
    
    // Verify connection
    console.log('Verifying SMTP connection...');
    const connectionValid = await transporter.verify();
    console.log('Connection valid:', connectionValid);
    
    // Define test email
    const recipient = process.argv[2] || 'test@example.com';
    
    // Send test email
    console.log(`Sending test email to ${recipient}...`);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL 
        ? `"${process.env.SMTP_FROM_NAME || 'Test'}" <${process.env.SMTP_FROM_EMAIL}>`
        : 'noreply@example.com',
      to: recipient,
      subject: 'Test Email - Password Reset Flow',
      text: 'This is a test email to verify the email sending functionality for password reset.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email - Password Reset</h2>
          <p>This is a test email to verify that your application can send emails for password resets.</p>
          <p>If you received this email, your email configuration is working correctly.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
    });
    
    console.log('Message sent:', info.messageId);
    
    // If using ethereal, provide URL to view email
    if (testAccount) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('Open the URL above to see the test email');
    }
    
    console.log('Email test completed successfully');
  } catch (error) {
    console.error('Error during email test:');
    console.error(error);
    process.exit(1);
  }
}

main().catch(console.error); 