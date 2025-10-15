// import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
// import { Response } from "express";

// interface UserPayload {
//   name: string;
//   userId: string;
//   role: string;
// }

// interface TokenPayload {
//   payload: UserPayload;
// }

// export const createJWT = ({ payload }: TokenPayload): string => {
//   const secret: Secret = process.env.JWT_SECRET as string;
//   if (!secret) throw new Error("JWT_SECRET is not defined.");

//   // ✅ Ensure lifetime always has a value
//   const lifetime: string | number = process.env.JWT_LIFETIME ?? "1d";

//   // ✅ TS fix: declare a concrete object, not partial
//   const options: SignOptions = {
//     expiresIn: lifetime as SignOptions['expiresIn'],
//   };

//   const token = jwt.sign(payload, secret, options);
//   return token;
// };

// export const isTokenValid = ({ token }: { token: string }): UserPayload => {
//   const secret: Secret = process.env.JWT_SECRET as string;
//   if (!secret) throw new Error("JWT_SECRET is not defined.");

//   const decoded = jwt.verify(token, secret) as JwtPayload & UserPayload;
//   return decoded;
// };

// export const attachCookiesToResponse = ({
//   res,
//   user,
// }: {
//   res: Response;
//   user: UserPayload;
// }): void => {
//   const token = createJWT({ payload: user });
//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     signed: true,
//   });
// };
