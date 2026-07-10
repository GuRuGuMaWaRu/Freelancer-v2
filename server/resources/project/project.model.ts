import mongoose, { type Document, type Model, Schema, Types } from "mongoose";

export interface IProject extends Document {
  user: Types.ObjectId;
  client: Types.ObjectId;
  projectNr: string;
  payment: number;
  currency: "USD" | "EUR";
  date: Date;
  deleted?: boolean;
  paid: boolean;
  comments?: string;
}

const projectSchema = new Schema<IProject>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A project must have a user"],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "A project must have a client"],
    },
    projectNr: {
      type: String,
      trim: true,
      required: true,
    },
    payment: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR"],
      default: "USD",
    },
    date: {
      type: Date,
      required: [true, "A project must have a date"],
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true },
);

projectSchema.index({
  user: 1,
  client: 1,
});

projectSchema.pre("findOne", function selectFields(next) {
  this.select("-user -__v");
  next();
});

projectSchema.pre("findOneAndUpdate", function populateClient(next) {
  this.populate("client").select(
    "client currency date payment paid projectNr _id comments",
  );
  next();
});

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema,
);

export default Project;
