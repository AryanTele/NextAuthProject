import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    userId: string;
    role: string;
  };
}

export function auth(handler: NextApiHandler) {
  return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = { userId: decoded.userId, role: decoded.role };
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
