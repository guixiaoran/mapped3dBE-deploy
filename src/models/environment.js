import mongoose, { Schema } from "mongoose";

const environment = new Schema({
  environmentName: { type: String, trim: true, required: true },
  environmentCreator: { type: String, trim: true, required: true },
  panorama: { type: Boolean, default: false, required: false },
  preset: { type: String, default: false, required: false },
  video: { type: String, default: false, required: false },
  floorColor: { type: String, trim: true, required: false },
  skyColor: { type: String, trim: true, required: false },
  skyUrl: { type: String, trim: true, required: false },
});

export default mongoose.model("environment", environment);
