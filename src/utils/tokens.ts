import jwt, { SignOptions, Secret } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Generate access token (short lived)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET as Secret;
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"];

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate refresh token (long lived)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as Secret;
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

  return jwt.sign(payload, secret, { expiresIn });
};
