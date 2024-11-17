import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";

const authSecret = secret("AUTH_SECRET");

// Encrypt the password
export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10); // Generate a salt
  const hashedPassword = await hash(password, salt); // Hash the password with the salt
  return hashedPassword; // Return the hashed password
};

// Check the password against the stored hash
export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return compare(password, hash); // Compare the password with the hash
};

interface TokenData {
  id: string;
  email: string;
}

// Generate a JWT token
export const generateToken = (data: TokenData): string => {
  return jwt.sign(data, authSecret(), { expiresIn: "1h" }); // Sign the data with the secret and set an expiration
};

// Verify a JWT token
export const verifyToken = (token: string): TokenData | null => {
  try {
    // Verify the token with the secret
    return jwt.verify(token, authSecret()) as TokenData;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token");
    } else {
      console.error("Unknown error verifying token", error);
    }
    return null; // Return null if the token is invalid or expired
  }
};
