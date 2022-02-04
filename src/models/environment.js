import mongoose, { Schema } from "mongoose";

const Environment = new Schema({
  // url: { type: String, trim: true, required: true },
  environmentName: { type: String, trim: true, required: true },
  environmentCreator: { type: String, trim: true, required: true },
  panorama: { type: String, trim: true, required: false },
  preset: { type: String, trim: true, required: false },
  video: { type: String, trim: true, required: false },
  floorColor: { type: String, trim: true, required: false },
  skyColor: { type: String, trim: true, required: false },
  // requirements: [{ type: String, trim: true, required: true }],
  deakinSSO: { type: Boolean, default: false },
  firstLogin: { type: Boolean, default: false },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  registrationDate: { type: Date, default: Date.now },
  codeUpdatedAt: { type: Date, default: Date.now, required: true },
  isBlocked: { type: Boolean, default: false, required: true },
});

export default mongoose.model("Environment", Environment);
