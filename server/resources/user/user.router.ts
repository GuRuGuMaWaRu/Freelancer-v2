import express from "express";
import { loginBodySchema, signupBodySchema } from "@pet-freelancer/shared";

import loginLimiter from "../../middleware/loginLimiter";
import { protect } from "../../middleware/auth";
import validateBody from "../../middleware/validateBody";
import * as authControllers from "./auth.controllers";
import userControllers from "./user.controllers";

const router = express.Router();

router.get("/getUser", protect, authControllers.getUser);

router.post(
  "/login",
  loginLimiter,
  validateBody(loginBodySchema),
  authControllers.login,
);

router.post(
  "/signup",
  validateBody(signupBodySchema),
  authControllers.signup,
);

router.use(protect);

router.route("/").get(userControllers.getAll);

router
  .route("/:id")
  .get(userControllers.getOne)
  .delete(userControllers.deleteOne);

export default router;
