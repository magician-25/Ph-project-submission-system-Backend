import type { Response } from "express";
import config from "../config";

export const setAccessTokenCookie = (response: Response, token: string) => {
    response.cookie("access_token", token, {
        httpOnly: true,
        secure: config.environment !== "development",
        sameSite: config.environment === "development" ? "lax" : "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
};
