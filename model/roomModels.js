const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  hotel: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  youtubeVideo: {
    type: String,
  }, 
  images: {
    type: [String],
    default: [],
   
  },
  price: {
    type: String,
    required: true,
  },
  numberOfRooms: {
    type: String,
    required: true,
  },
  numberOfBeds: {
    type: String,
    required: true,
  },
  maxOccupancy: {
    adults: {
      type: String,
      required: true,
    },
    children: {
      type: String,
      required: true,
    },
  },
  acreage: {
    type: String,
  },
});

module.exports = mongoose.model("Room", roomSchema);
