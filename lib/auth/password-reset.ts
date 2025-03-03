import { randomBytes } from 'crypto';
import { db } from '@/db/index';

/**
 * Generates a password reset token
 * @param email The email address to associate with the token
 * @param expiresInMinutes How many minutes until the token expires (default: 60 minutes / 1 hour)
 * @returns The generated token string
 */
export async function generatePasswordResetToken(
  email: string,
  expiresInMinutes: number = 60
) {
  console.log(`Generating password reset token for: ${email}`);
  
  try {
    // Delete any existing tokens for this email
    const deletedTokens = await db.verificationToken.deleteMany({
      where: { 
        identifier: `password_reset_${email}` 
      },
    });
    console.log(`Deleted ${deletedTokens.count} existing password reset tokens`);

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    console.log(`Generated password reset token: ${token.substring(0, 10)}...`);
    
    // Set expiry time
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expiresInMinutes);
    console.log(`Token expires at: ${expires.toISOString()}`);

    // Store the token in the database
    const storedToken = await db.verificationToken.create({
      data: {
        identifier: `password_reset_${email}`,
        token,
        expires,
      },
    });
    console.log(`Password reset token stored successfully with expiry: ${storedToken.expires}`);

    return token;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    throw error;
  }
}

/**
 * Validates a password reset token
 * @param email The email associated with the token
 * @param token The token to verify
 * @returns Boolean indicating if the token is valid
 */
export async function validatePasswordResetToken(
  email: string, 
  token: string
): Promise<boolean> {
  console.log(`Validating password reset token for: ${email}`);
  
  try {
    const passwordResetToken = await db.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `password_reset_${email}`,
          token,
        },
      },
    });

    if (!passwordResetToken) {
      console.log('Password reset token not found');
      return false;
    }

    const now = new Date();
    const isExpired = now > passwordResetToken.expires;
    console.log(`Token expired: ${isExpired}, expires: ${passwordResetToken.expires}, now: ${now}`);

    return !isExpired;
  } catch (error) {
    console.error('Error validating password reset token:', error);
    return false;
  }
}

/**
 * Consumes a password reset token and updates the user's password
 * @param email The email associated with the token
 * @param token The token to verify
 * @param newPassword The new password to set
 * @returns Boolean indicating if the password was successfully reset
 */
export async function resetPassword(
  email: string,
  token: string,
  hashedNewPassword: string
): Promise<boolean> {
  console.log(`Attempting to reset password for: ${email}`);
  
  // First validate the token
  const isValid = await validatePasswordResetToken(email, token);
  
  if (!isValid) {
    console.log('Invalid or expired password reset token');
    return false;
  }

  try {
    // Update the user's password
    await db.user.update({
      where: { email },
      data: { 
        hashedPassword: hashedNewPassword,
      },
    });
    console.log(`Password updated successfully for: ${email}`);

    // Delete the token as it's been used
    await db.verificationToken.deleteMany({
      where: {
        identifier: `password_reset_${email}`,
      },
    });
    console.log('Password reset token deleted');

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
} 