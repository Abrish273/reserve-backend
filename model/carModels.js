const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
    {
        carName: {
            type: String,
            required: [true, "Please enter the car name"]
        },
        brand: {
            type: String,
            required: [true, "Please enter the brand"]
        },
        youtubeVideo: {
            type: String,
          }, 
        price: {
            type: Number,
            required: [true, "Please enter the price"]
        },
        color: {
            type: String,
        },
    
        Content: {
            type: String,
            required: [true, "Please enter content text"]
        },
        Passenger: {
            type: Number,
            required: [true, "Please enter the passenger"]
        },
        GearShift: {
            type: String,
            required: [true, "Please enter the gear shift"]
        },
        images: {
            type: [String],
            default: [],
            required: [true, "Please provide  images"]
        },
        Door: {
            type: Number,
            required: [true, "Please enter the door"]
        }
    },
    {
        timestamps: true
    }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
