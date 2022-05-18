"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var s3BucketCredentials = {
  projectFolder: "mapp3d-jason",
  bucket: "mapp3d-jason",
  accessKeyId: "AKIAZPWFJAYPT42HJY4E",
  secretAccessKey: "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",
  s3URL: "https://mapp3d-jason.s3.ap-southeast-2.amazonaws.com",
  folder: {
    profilePicture: "profilePicture",
    thumb: "thumb",
    original: "original",
    image: "image",
    docs: "docs",
    files: "files",
    video: "video",
    audio: "audio"
  }
};
var _default = {
  s3BucketCredentials: s3BucketCredentials
};
exports["default"] = _default;