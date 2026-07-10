import type { Model } from "mongoose";

import catchAsync from "./catchAsync";
import AppError from "./appError";
import APIFeatures from "./apiFeatures";

const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req, res) => {
    const filter: Record<string, unknown> = {};

    if (req.userId && Model.collection.collectionName !== "users") {
      filter.user = req.userId;
    }

    const { query } = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await query.lean().exec();

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

const getOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError(400, "Item ID is required"));
    }

    const filter: Record<string, unknown> = { _id: id };

    if (req.userId && Model.collection.collectionName !== "users") {
      filter.user = req.userId;
    }

    const doc = await Model.findOne(filter).lean().exec();

    if (!doc) {
      return next(new AppError(404, "No doc found with this ID"));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError(400, "Item ID is required"));
    }

    const filter: Record<string, unknown> = { _id: id };

    if (req.userId && Model.collection.collectionName !== "users") {
      filter.user = req.userId;
    }

    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!doc) {
      return next(new AppError(404, "No doc found with this ID"));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError(400, "Item ID is required"));
    }

    const filter: Record<string, unknown> = { _id: id };

    if (req.userId && Model.collection.collectionName !== "users") {
      filter.user = req.userId;
    }

    const doc = await Model.findOneAndUpdate(
      filter,
      { deleted: true },
      { new: true },
    )
      .lean()
      .exec();

    if (!doc) {
      return next(new AppError(404, "Nothing is found with the provided ID"));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  });

const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res) => {
    const body = { ...req.body };

    if (req.userId && Model.collection.collectionName !== "users") {
      body.user = req.userId;
    }

    const doc = await Model.create(body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

export default <T>(Model: Model<T>) => ({
  getAll: getAll(Model),
  getOne: getOne(Model),
  updateOne: updateOne(Model),
  deleteOne: deleteOne(Model),
  createOne: createOne(Model),
});
