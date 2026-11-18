import express from "express";

import userRouter from "./user/user.router";
import clientRouter from "./client/client.router";
import projectRouter from "./project/project.router";

const router = express.Router();

router.use("/users", userRouter);
router.use("/clients", clientRouter);
router.use("/projects", projectRouter);

export default router;
