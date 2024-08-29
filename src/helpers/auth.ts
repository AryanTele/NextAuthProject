import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { jwtVerify } from "jose";

interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: JwtPayload;
}

export function auth(handler: NextApiHandler) {
  return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token with the secret
      const { payload } = (await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET as string)
      )) as { payload: JwtPayload };

      req.user = { userId: payload.userId, role: payload.role };
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
