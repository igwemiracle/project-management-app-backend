import "express";

export interface TokenPayload {
  id: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}
