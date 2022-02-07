import mongoose, { Schema } from "mongoose";

const Environment = new Schema({
  environmentName: { type: String, trim: true, required: true },
  environmentCreator: { type: String, trim: true, required: true },
  panorama: { type: String, trim: true, required: false },
  preset: { type: String, trim: true, required: false },
  video: { type: String, trim: true, required: false },
  floorColor: { type: String, trim: true, required: false },
  skyColor: { type: String, trim: true, required: false },
  skyUrl: { type: String, trim: true, required: false },
  // localObjectsId: [{ type: String, trim: true, required: false }],
  vrObjects: [{ type: Schema.Types.ObjectId, ref: "LocalObject" }],
});

export default mongoose.model("Environment", Environment);
