// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model";

// interface TokenPayload {
//   userId: string;
//   role: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: TokenPayload;
//     }
//   }
// }

// export const authenticateUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Authentication invalid" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

//     // ✅ Fetch user from DB to check verification
//     const user = await User.findById(decoded.userId);
//     if (!user) return res.status(401).json({ message: "Authentication invalid" });

//     // ✅ Check if email is verified
//     if (!user.isVerified) {
//       return res.status(403).json({ message: "Please verify your email before accessing this resource." });
//     }

//     req.user = { id: user._id.toString(), role: user.role };
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Authentication invalid" });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface TokenPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as TokenPayload;

    // optional: ensure user still exists and is verified
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Authentication invalid" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before accessing this resource." });
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication invalid" });
  }
};
