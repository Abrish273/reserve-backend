const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
    required: [true, "Please provide at least 6 images"],
  },
  youtubeVideo: {
    type: String,
  },   
   location: {
    type: [Number],
    required: true,
  },
  price: {
        type: String,
      required: [true, "Please enter the price"],
    },
  
  faqs: [{
    question: String,
    answer: String,
  }],
  extraInformation: {
    numberOfBeds: {
      type: Number,
      required: true,
    },
    numberOfBathrooms: {
      type: Number,
      required: true,
    },

    squareLocation: {
     
    },
    realSpaceAddress: {
      type: String,
      required: true,
    },
    pricingTable: {
      allInPrice: {
        type: Number,
      },
    },
    maxGuests: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
  },
});

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;
