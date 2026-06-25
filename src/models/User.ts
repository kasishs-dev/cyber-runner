import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  image?: string;
  coins: number;
  highScore: number;
  totalDistance: number;
  skins: string[];
  activeSkin: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  image: { type: String },
  coins: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  totalDistance: { type: Number, default: 0 },
  skins: { type: [String], default: ["default"] },
  boards: { type: [String], default: ["surf_basic"] },
  activeSkin: { type: String, default: "default" },
  activeBoard: { type: String, default: "surf_basic" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
