import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendResponse from "../config/sendResponse";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return sendResponse(res,401,false,"Unauthorized","Missing or invalid Authorization header",[]);
      }

      const token = header.split(" ")[1] as string;

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      req.user = decoded;

      if (roles.length > 0) {
        const userRole = decoded.role as string;

        if (!roles.includes(userRole)) {
          return sendResponse(res,403,false,"Forbidden","You are not allowed to access this resource",[]);
        }
      }

      next();
    } catch (err: any) {
      return sendResponse(res,401,false,"Unauthorized","Invalid or expired token",[]);
    }
  };
};

export default auth;