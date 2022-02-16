import mongoose, { Schema } from "mongoose";

const PublicObject = new Schema({
  creatorID: { type: Schema.Types.ObjectId, ref: "user", required: true },
  objectType: { type: String, trim: true, required: true },
  objectName: { type: String, trim: true, required: true },
  url: { type: String, trim: true, required: false },
});

export default mongoose.model("PublicObject", PublicObject);
