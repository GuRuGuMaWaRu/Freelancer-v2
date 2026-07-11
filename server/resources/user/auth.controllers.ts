import jwt from "jsonwebtoken";

import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import jwtSignOptions from "../../utils/jwtOptions";
import User from "./user.model";

interface JwtPayload {
  id: string;
}

const newToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, jwtSignOptions);

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, "All fields are required"));
  }

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return next(new AppError(400, "Invalid credentials"));
  }

  const match = await foundUser.comparePasswords(password, foundUser.password);

  if (!match) {
    return next(new AppError(400, "Invalid credentials"));
  }

  const payload: JwtPayload = {
    id: foundUser._id.toString(),
  };

  const token = newToken(payload);

  res.status(200).json({
    status: "success",
    message: `${foundUser.name} logged in successfully`,
    data: { name: foundUser.name, email, token },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId)
    .select("-password -_id -__v")
    .lean()
    .exec();

  if (!user) {
    return next(
      new AppError(406, "Token is invalid, there is no corresponding user"),
    );
  }

  const payload: JwtPayload = {
    id: req.userId as string,
  };

  const token = newToken(payload);

  res.status(200).json({
    status: "success",
    message: `${user.name} logged in successfully`,
    data: { ...user, token },
  });
});

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate) {
    return next(new AppError(409, "User already exists"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = newToken({ id: user._id.toString() });

    return res.status(201).json({
      status: "success",
      message: `${user.name} registered successfully`,
      data: { name, email, token },
    });
  }

  return next(new AppError(400, "Invalid user data received"));
});

export { login, getUser, signup };
