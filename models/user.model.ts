import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  image?: string;
  queriesToday: number;
  lastQueryAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    queriesToday: { type: Number, default: 0 },
    lastQueryAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
