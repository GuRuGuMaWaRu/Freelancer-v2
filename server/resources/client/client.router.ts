import express from "express";
import {
  createClientBodySchema,
  updateClientBodySchema,
} from "@pet-freelancer/shared";

import { protect } from "../../middleware/auth";
import validateBody from "../../middleware/validateBody";
import clientControllers from "./client.controllers";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(clientControllers.getAll)
  .post(validateBody(createClientBodySchema), clientControllers.createOne);

router
  .route("/withProjectData")
  .get(clientControllers.getClientWithProjectData);

router
  .route("/:id")
  .get(clientControllers.getOne)
  .patch(validateBody(updateClientBodySchema), clientControllers.updateOne)
  .delete(clientControllers.deleteOne);

export default router;
