import status from "http-status";
import type { Role } from "../../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { RequestUser } from "../types";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "../utils/async-handler";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export const auth = (...roles: Role[]) => {
  return asyncHandler(async (req, _, next) => {
    const token = req.cookies?.access_token
      ? req.cookies?.access_token
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(
        status.BAD_REQUEST,
        "You are not logged in. Please log in to access this resource.",
      );
    }

    const decodedData = verifyToken(token);

    if (!decodedData.success || !decodedData.data) {
      throw new AppError(status.BAD_REQUEST, `${decodedData.message}`);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedData.data.id,
      },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (user.user_status === "BAN") {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are banned. please contact support",
      );
    }

    if (roles.length > 0) {
      if (!user.role || !roles.includes(user.role)) {
        throw new AppError(status.UNAUTHORIZED, "You are unauthorized");
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      batch_id: user.batch_id,
    };
    next();
  });
};
