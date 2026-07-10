import express, { type Response } from "express";
import mongoose from "mongoose";

import catchAsync from "../../utils/catchAsync";
import { protect } from "../../middleware/auth";
import clientControllers from "./client.controllers";
import Project from "../project/project.model";
import type AuthenticatedRequest from "../../types/authenticated-request";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(clientControllers.getAll)
  .post(clientControllers.createOne);

router.route("/withProjectData").get(
  catchAsync<AuthenticatedRequest>(async (req, res: Response) => {
    const currentDate = new Date();
    const last30Days = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last90Days = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000);
    const last365Days = new Date(
      currentDate.getTime() - 365 * 24 * 60 * 60 * 1000,
    );

    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "clientDetails",
        },
      },
      {
        $unwind: "$clientDetails",
      },
      {
        $addFields: {
          projectsLast30Days: {
            $cond: { if: { $gte: ["$date", last30Days] }, then: 1, else: 0 },
          },
          projectsLast90Days: {
            $cond: { if: { $gte: ["$date", last90Days] }, then: 1, else: 0 },
          },
          projectsLast365Days: {
            $cond: { if: { $gte: ["$date", last365Days] }, then: 1, else: 0 },
          },
        },
      },
      {
        $group: {
          _id: "$client",
          name: { $first: "$clientDetails.name" },
          totalProjects: { $sum: 1 },
          firstProjectDate: { $min: "$date" },
          lastProjectDate: { $max: "$date" },
          totalEarnings: { $sum: "$payment" },
          projectsLast30Days: { $sum: "$projectsLast30Days" },
          projectsLast90Days: { $sum: "$projectsLast90Days" },
          projectsLast365Days: { $sum: "$projectsLast365Days" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalProjects: 1,
          firstProjectDate: 1,
          lastProjectDate: 1,
          totalEarnings: 1,
          projectsLast30Days: 1,
          projectsLast90Days: 1,
          projectsLast365Days: 1,
          daysSinceLastProject: {
            $trunc: {
              $divide: [
                {
                  $subtract: [currentDate, "$lastProjectDate"],
                },
                24 * 60 * 60 * 1000,
              ],
            },
          },
        },
      },
    ];

    const result = await Project.aggregate(pipeline);

    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  }),
);

router
  .route("/:id")
  .get(clientControllers.getOne)
  .patch(clientControllers.updateOne)
  .delete(clientControllers.deleteOne);

export default router;
