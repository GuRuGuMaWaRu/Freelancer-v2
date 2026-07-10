import mongoose, { type Document, type Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  deleted?: boolean;
  comparePasswords(password1: string, password2: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6,
  },
  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

userSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.methods.comparePasswords = async (
  password1: string,
  password2: string,
) => bcrypt.compare(password1, password2);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
