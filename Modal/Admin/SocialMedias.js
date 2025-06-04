const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SocialMedias = new Schema(
  {
    MediaName: {
      type: String,
    },
    MediaURL: {
      type: String,
    },
  },
  { timestamps: true }
);

const SocialMediasModel = mongoose.model("Social Medias", SocialMedias);
module.exports = SocialMediasModel;
