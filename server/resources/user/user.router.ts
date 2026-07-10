import express from "express";
import { check } from "express-validator";

import loginLimiter from "../../middleware/loginLimiter";
import { protect } from "../../middleware/auth";
import validateForm from "../../middleware/validation";
import * as authControllers from "./auth.controllers";
import userControllers from "./user.controllers";

const router = express.Router();

router.get("/getUser", protect, authControllers.getUser);

router.post(
  "/login",
  loginLimiter,
  [
    check("email", "Please provide valid email").isEmail(),
    check("password", "Please provide password").exists(),
  ],
  validateForm,
  authControllers.login,
);

router.post(
  "/signup",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please provide valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({ min: 6 }),
  ],
  validateForm,
  authControllers.signup,
);

router.use(protect);

router.route("/").get(userControllers.getAll);

router
  .route("/:id")
  .get(userControllers.getOne)
  .delete(userControllers.deleteOne);

export default router;
