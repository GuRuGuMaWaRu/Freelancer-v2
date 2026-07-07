const express = require("express");
const mongoose = require("mongoose");

const catchAsync = require("../../utils/catchAsync");
const { protect } = require("../../middleware/auth");
const clientControllers = require("./client.controllers");
const Project = require("../project/project.model");

const router = express.Router();

router.use(protect);

router
  .route("/")
  /**
   * @route     GET clients/
   * @desc      Get all clients
   * @access    Private
   */
  .get(clientControllers.getAll)
  /**
   * @route     POST clients/
   * @desc      Create client
   * @access    Private
   */
  .post(clientControllers.createOne);

router
  .route("/withProjectData")
  /**
   * @route     GET projects/withProjectData
   * @desc      Get clients with project statistics
   * @access    Private
   */
  .get(
    catchAsync(async (req, res) => {
      const currentDate = new Date();
      const last30Days = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
      const last90Days = new Date(currentDate - 90 * 24 * 60 * 60 * 1000);
      const last365Days = new Date(currentDate - 365 * 24 * 60 * 60 * 1000);

      const pipeline = [
        {
          $match: {
            user: mongoose.Types.ObjectId(req.userId),
            deleted: false,
          },
        },
        //* Populate the client details
        {
          $lookup: {
            from: "clients",
            localField: "client",
            foreignField: "_id",
            as: "clientDetails",
          },
        },
        //* Unwind the clientDetails array
        {
          $unwind: "$clientDetails",
        },
        //* Add fields to calculate number of projects for different time periods
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
        //* Group projects by client and calculate sums
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
        //* Choose what data to return
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
                  24 * 60 * 60 * 1000, // Convert milliseconds to days
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
  /**
   * @route     GET clients/:id
   * @desc      Get client
   * @access    Private
   */
  .get(clientControllers.getOne)
  /**
   * @route     PATCH clients/:id
   * @desc      Update client
   * @access    Private
   */
  .patch(clientControllers.updateOne)
  /**
   * @route     DELETE clients/:id
   * @desc      Delete client
   * @access    Private
   */
  .delete(clientControllers.deleteOne);

module.exports = router;
