const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  youtubeVideo: {
    type: String,
  },
  duration: {
    type: String,
    required: true,
  },
  tourNumberPerson: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
  location: {
    type: [String],
    required: true,
  },
  realTourAddress: {
    type: String,
    required: true,
  },
  fixedPrice: {
    allInPrice: {
      type: Number,
      required: true,
    },
    minGuests: {
      type: Number,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
  },
  priceByTypeOfPerson: {
    children: {
      price: {
        type: Number,
        required: true,
      },
      minGuests: {
        type: Number,
        required: true,
      },
      maxGuests: {
        type: Number,
        required: true,
      },
    },
    adults: {
      price: {
        type: Number,
        required: true,
      },
      minGuests: {
        type: Number,
        required: true,
      },
      maxGuests: {
        type: Number,
        required: true,
      },
    },
    oldPeople: {
      price: {
        type: Number,
       
      },
      minGuests: {
        type: Number,
       
      },
      maxGuests: {
        type: Number,
  
      },
    },
  },
  extraService: {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["OneTime", "PerPerson"],
      required: true,
    },
  },
  availabilityCalendar: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
