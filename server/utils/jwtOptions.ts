import type { SignOptions } from "jsonwebtoken";

const jwtSignOptions: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
};

export default jwtSignOptions;
