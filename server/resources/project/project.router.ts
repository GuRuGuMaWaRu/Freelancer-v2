import express from "express";

import {
  createProjectBodySchema,
  updateProjectBodySchema,
} from "@pet-freelancer/shared";

import { protect } from "../../middleware/auth";
import validateBody from "../../middleware/validateBody";
import projectControllers from "./project.controllers";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(projectControllers.getAll)
  .post(validateBody(createProjectBodySchema), projectControllers.addOne);

router.route("/forChart").get(projectControllers.getDataForCharts);

router
  .route("/:id")
  .get(projectControllers.getOne)
  .patch(validateBody(updateProjectBodySchema), projectControllers.updateOne)
  .delete(projectControllers.deleteOne);

export default router;
