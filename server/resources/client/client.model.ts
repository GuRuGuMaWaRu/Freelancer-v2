import mongoose, { type Document, type Model, Schema, Types } from "mongoose";

export interface IClient extends Document {
  user: Types.ObjectId;
  name: string;
  deleted?: boolean;
}

const clientSchema = new Schema<IClient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A client must have a user"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "A client must have a name"],
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true },
);

clientSchema.index(
  {
    user: 1,
    name: 1,
  },
  { unique: true },
);

clientSchema.pre("find", function filterDeleted(next) {
  this.find({ deleted: { $ne: true } }).sort({ name: 1 });
  next();
});

clientSchema.pre("findOne", function selectName(next) {
  this.select("name");
  next();
});

const Client: Model<IClient> = mongoose.model<IClient>("Client", clientSchema);

export default Client;
