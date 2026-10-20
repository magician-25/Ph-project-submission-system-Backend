import type z from "zod";
import { asyncHandler } from "./async-handler";

const validateSchema = (schema: z.ZodObject) => {
    return asyncHandler((req, _, next) => {
        const payload = req.body;

        const result = schema.parse(payload);

        req.body = result;

        next();
    });
};

export default validateSchema;
