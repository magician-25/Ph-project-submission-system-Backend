import { z } from "zod";

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(72, "Password cannot exceed 72 characters");

export const signupSchema = z.object({
	name: z.string().trim().min(1).max(100),
	batchId: z.string().uuid(),
	email: z
		.string()
		.trim()
		.email()
		.max(254)
		.transform((email) => email.toLowerCase()),
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.email()
		.max(254)
		.transform((email) => email.toLowerCase()),
	password: z.string().min(1).max(72),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
