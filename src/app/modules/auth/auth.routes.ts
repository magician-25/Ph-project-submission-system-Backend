import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { AuthController } from "./auth.controller";
import { loginSchema, signupSchema, userIdParamsSchema } from "./auth.schemas";

const router = Router();

router.post(
	"/signup",
	validateSchema(signupSchema),
	AuthController.createStudentAccount,
);
router.post("/login", validateSchema(loginSchema), AuthController.login);

router.post("/logout", auth(), AuthController.logout);

router.get("/me", auth(), AuthController.getMe);
router.get("/users", auth("ADMIN"), AuthController.getUsers);

router.patch(
	"/:userId/mentor",
	auth("ADMIN"),
	validateSchema(userIdParamsSchema, "params"),
	AuthController.promoteStudentToMentor,
);

export const AuthRoutes = router;
