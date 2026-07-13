import express from "express";
import mongoose, { type PipelineStage } from "mongoose";
import {
  createProjectBodySchema,
  updateProjectBodySchema,
} from "@pet-freelancer/shared";

import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import parseClientName from "../../utils/parseClientName";
import { protect } from "../../middleware/auth";
import validateBody from "../../middleware/validateBody";
import projectControllers from "./project.controllers";
import Project from "./project.model";
import Client from "../client/client.model";

const router = express.Router();

router.use(protect);

const projectsDefaultAggregationStages = [
  {
    $lookup: {
      from: "clients",
      localField: "client",
      foreignField: "_id",
      as: "client",
    },
  },
  {
    $project: {
      _id: 1,
      projectNr: 1,
      payment: 1,
      currency: 1,
      date: 1,
      paid: 1,
      comments: 1,
      client: { $first: "$client" },
    },
  },
];

router
  .route("/")
  .get(
    catchAsync(async (req, res, next) => {
      if (!req.userId) {
        return next(new AppError(400, "User ID is required"));
      }

      const aggregationPipeline: PipelineStage[] = [
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.userId),
            deleted: { $ne: true },
          },
        },
        ...projectsDefaultAggregationStages,
      ];

      const searchQuery = new RegExp(String(req.query.q ?? ""), "i");

      if (Object.hasOwn(req.query, "q")) {
        aggregationPipeline.push({
          $match: {
            $or: [{ "client.name": searchQuery }, { projectNr: searchQuery }],
          },
        });
      }

      if (Object.hasOwn(req.query, "sort") && typeof req.query.sort === "string") {
        const sortDir = req.query.sort.startsWith("-") ? -1 : 1;
        const sortItem = req.query.sort.replace("-", "");

        if (!req.query.sort.includes("date")) {
          aggregationPipeline.push({
            $sort: { [sortItem]: sortDir, date: -1 },
          });
        } else {
          aggregationPipeline.push({
            $sort: { [sortItem]: sortDir, _id: 1 },
          });
        }
      } else {
        aggregationPipeline.push({
          $sort: { date: -1, _id: 1 },
        });
      }

      if (
        Object.hasOwn(req.query, "limit") &&
        Object.hasOwn(req.query, "page")
      ) {
        aggregationPipeline.push(
          {
            $skip: (Number(req.query.page) - 1) * Number(req.query.limit),
          },
          { $limit: Number(req.query.limit) },
        );
      }

      const docs = await Project.aggregate(aggregationPipeline);

      const count = await Project.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.userId),
            deleted: { $ne: true },
          },
        },
        ...projectsDefaultAggregationStages,
        {
          $match: {
            $or: [{ "client.name": searchQuery }, { projectNr: searchQuery }],
          },
        },
        { $count: "total" },
      ]);

      res.status(200).json({
        status: "success",
        results: docs.length,
        data: { docs, allDocs: docs.length ? count[0].total : 0 },
      });
    }),
  )
  .post(
    validateBody(createProjectBodySchema),
    catchAsync(async (req, res, next) => {
      if (!req.userId) {
        return next(new AppError(400, "User ID is required"));
      }

      const clientName = parseClientName(req.body.client);

      if (!clientName) {
        return next(new AppError(422, "Validation error"));
      }

      let client = await Client.findOne({
        name: clientName,
        user: req.userId,
      })
        .lean()
        .exec();

      if (!client) {
        client = await Client.create({
          name: clientName,
          user: req.userId,
        });
      }

      const doc = await Project.create({
        ...req.body,
        client: client._id,
        user: req.userId,
      });

      res.status(201).json({
        status: "success",
        data: doc.toJSON(),
      });
    }),
  );

router.route("/forChart").get(
  catchAsync(async (req, res, next) => {
    if (!req.userId) {
      return next(new AppError(400, "User ID is required"));
    }

    const filter: Record<string, unknown> = {
      user: new mongoose.Types.ObjectId(req.userId),
      deleted: false,
    };

    const months = parseInt(String(req.query.months), 10);

    if (!Number.isNaN(months) && months > 0) {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - (months - 1));
      fromDate.setDate(1);
      fromDate.setHours(0, 0, 0, 0);
      filter.date = { $gte: fromDate };
    }

    const projects = await Project.find(filter)
      .populate({
        path: "client",
        select: "-_id -user -__v -createdAt -updatedAt",
      })
      .lean()
      .exec();

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects,
    });
  }),
);

router
  .route("/:id")
  .get(projectControllers.getOne)
  .patch(
    validateBody(updateProjectBodySchema),
    catchAsync(async (req, res, next) => {
      if (!req.userId) {
        return next(new AppError(400, "User ID is required"));
      }

      const clientName = parseClientName(req.body.client);

      if (!clientName) {
        return next(new AppError(422, "Validation error"));
      }

      const existingProject = await Project.findOne({
        _id: req.params.id,
        user: req.userId,
      })
        .lean()
        .exec();

      if (!existingProject) {
        return next(new AppError(404, "No such project found"));
      }

      let client = await Client.findOne({
        name: clientName,
        user: req.userId,
      })
        .lean()
        .exec();

      if (!client) {
        client = await Client.create({
          name: clientName,
          user: req.userId,
        });
      }

      const doc = await Project.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { ...req.body, client: client._id },
        {
          new: true,
          runValidators: true,
        },
      )
        .lean()
        .exec();

      if (!doc) {
        return next(new AppError(404, "No such project found"));
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    }),
  )
  .delete(projectControllers.deleteOne);

export default router;
