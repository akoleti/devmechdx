import { randomBytes } from 'crypto';
import { db } from '@/db/index';

/**
 * Normalizes a verification code by removing hyphens
 * @param code The verification code that might contain hyphens
 * @returns The normalized code without hyphens
 */
function normalizeToken(code: string): string {
  // Remove any hyphens from the code
  return code.replace(/-/g, '');
}

/**
 * Generates a verification token for email verification
 * @param email The email address to associate with the token
 * @param expiresInHours How many hours until the token expires
 * @returns The generated token string
 */
export async function generateVerificationToken(
  email: string,
  expiresInHours: number = 24
) {
  console.log(`Generating verification token for: ${email}`);
  
  try {
    // Delete any existing tokens for this email
    const deletedTokens = await db.verificationToken.deleteMany({
      where: { identifier: email },
    });
    console.log(`Deleted ${deletedTokens.count} existing tokens`);

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    console.log(`Generated token: ${token.substring(0, 10)}...`);
    
    // Set expiry time
    const expires = new Date();
    expires.setHours(expires.getHours() + expiresInHours);
    console.log(`Token expires at: ${expires.toISOString()}`);

    // Store the token in the database
    const storedToken = await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
    console.log(`Token stored successfully with expiry: ${storedToken.expires}`);

    return token;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw error;
  }
}

/**
 * Verify a token is valid and not expired
 * @param email The email associated with the token
 * @param token The token to verify
 * @returns Boolean indicating if the token is valid
 */
export async function verifyToken(email: string, token: string): Promise<boolean> {
  console.log(`Verifying token for email: ${email}`);
  console.log(`Token to verify: ${token.substring(0, 10)}...`);
  
  try {
    // First try to verify with the token as-is (full token)
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    console.log(`Token found (direct match): ${!!verificationToken}`);
    
    if (verificationToken) {
      const now = new Date();
      const isExpired = now > verificationToken.expires;
      console.log(`Token expired: ${isExpired}, expires: ${verificationToken.expires}, now: ${now}`);
      
      if (isExpired) return false;
      return true;
    }
    
    // If the token wasn't found directly, try searching for all tokens for this email
    // This handles the case where we're trying to verify with a short code
    const allTokens = await db.verificationToken.findMany({
      where: {
        identifier: email,
      },
    });
    
    console.log(`Found ${allTokens.length} tokens for email ${email}`);
    
    // Get the normalized version of our token (without hyphens)
    const normalizedToken = normalizeToken(token);
    
    // Check if any of the tokens match our short code
    for (const fullToken of allTokens) {
      // Format the full token to get the short code
      const shortCode = formatVerificationCode(fullToken.token);
      // Normalize the short code (remove hyphens)
      const normalizedShortCode = normalizeToken(shortCode);
      
      console.log(`Comparing normalized code "${normalizedToken}" with stored code "${normalizedShortCode}"`);
      
      if (normalizedToken === normalizedShortCode) {
        console.log('Found matching short code!');
        
        const now = new Date();
        const isExpired = now > fullToken.expires;
        console.log(`Token expired: ${isExpired}, expires: ${fullToken.expires}, now: ${now}`);
        
        if (isExpired) return false;
        return true;
      }
    }
    
    console.log('No matching token found');
    return false;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

/**
 * Consumes a verification token and updates user's email verification status
 * @param email The email associated with the token
 * @param token The token to consume
 * @returns Boolean indicating if the process was successful
 */
export async function consumeVerificationToken(email: string, token: string): Promise<boolean> {
  const isValid = await verifyToken(email, token);
  
  if (!isValid) return false;

  try {
    // Find the user and update their verification status
    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete all tokens for this email as they're no longer needed
    await db.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    return true;
  } catch (error) {
    console.error('Error consuming verification token:', error);
    return false;
  }
}

/**
 * Formats a verification token into a 6-digit format for easier manual entry
 * @param token The full token
 * @returns A formatted 6-digit code derived from the token
 */
export function formatVerificationCode(token: string): string {
  // Create a more user-friendly verification code
  // Generate a 6-character alphanumeric code from the token
  // We'll use a simple algorithm to generate readable characters
  
  // Use the first few bytes of the token to generate a numeric code
  const bytes = token.substring(0, 12);
  
  // Generate a 6-character code with only uppercase letters and numbers
  // Exclude similar-looking characters like O/0, I/1, etc.
  const validChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  
  // Use chunks of 2 characters from the token to generate each character of our code
  for (let i = 0; i < 6; i++) {
    const chunk = bytes.substring(i * 2, i * 2 + 2);
    // Convert to a number and use modulo to get a valid index
    const index = parseInt(chunk, 16) % validChars.length;
    code += validChars[index];
  }
  
  // Insert a hyphen in the middle for better readability
  return code.substring(0, 3) + '-' + code.substring(3);
} 