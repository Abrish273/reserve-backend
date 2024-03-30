
const mongoose = require("mongoose");

const boatSchema = mongoose.Schema(
    {
        boatName: {
            type: String,
            required: [true, "Please enter the boat name"]
        },
        location: {
            type: [Number],
            required: true,
          },
        price: {
            type: String,
            required: [true, "Please enter the price"]
        },
        youtubeVideo: {
            type: String,
          }, 
        images: {
            type: [String],
            default: [],
            required: [true, "Please provide at least 6 images"]
        },
        contentText: {
            type: String,
            required: [true, "Please enter content text"]
        },
        averageRating: {
            type: Number,
            default: 0,
          },
          numOfReviews: {
            type: Number,
            default: 0,
          },
          user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
          },
        checkInTime: {
            type: String,
            required: [true, "Please enter the check-in time"]
        },
        checkOutTime: {
            type: String,
            required: [true, "Please enter the check-out time"]
        },
        boatPolicy: {
            type: String,
            required: [true, "Please enter the boat policy"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Boat", boatSchema);

