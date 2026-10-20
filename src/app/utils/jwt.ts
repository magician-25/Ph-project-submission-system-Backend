import jwt from "jsonwebtoken";
import type { IJwtPayload } from "../types";

const jwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters");
    }
    return secret;
};

export const signToken = (payload: IJwtPayload): string => {
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "1d";
    return jwt.sign(payload, jwtSecret(), {
        expiresIn: expiresIn as NonNullable<jwt.SignOptions["expiresIn"]>,
    });
};

export const verifyToken = (
    token: string,
):
    | { success: true; message: string; data: IJwtPayload }
    | { success: false; message: string } => {
    try {
        const decoded = jwt.verify(token, jwtSecret()) as IJwtPayload;

        return {
            success: true,
            message: "Token verified",
            data: { id: decoded.id, role: decoded.role, email: decoded.email },
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof jwt.JsonWebTokenError
                    ? error.message
                    : "Error while verifying token",
        };
    }
};
