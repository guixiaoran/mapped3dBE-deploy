import mongoose, { Schema } from "mongoose";

const localObjectItem = new Schema({
  environmentId: { type: String, trim: true, required: true },
  objectName: { type: String, trim: true, required: true },
  position: { type: String, trim: true, required: true },
  scale: { type: String, trim: true, required: false },
  rotation: { type: String, trim: true, required: false },
  url: { type: String, trim: true, required: false },
});

export default mongoose.model("localObjectItem", localObjectItem);
