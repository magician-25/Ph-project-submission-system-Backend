import { z } from "zod";

const passwordSchema = z
	.string({ error: "Password must be text" })
	.min(8, "Password must be at least 8 characters")
	.max(72, "Password cannot exceed 72 characters");

export const signupSchema = z.object({
	name: z
		.string({ error: "Name must be text" })
		.trim()
		.min(1, "Name is required")
		.max(100, "Name cannot exceed 100 characters"),
	batchId: z.uuid("Batch ID must be a valid UUID"),
	email: z.email("Enter a valid email address"),
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z
		.string({ error: "Password must be text" })
		.min(1, "Password is required")
		.max(72, "Password cannot exceed 72 characters"),
});

export type SignupPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
