const Car = require("../model/carModels");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const baseURL = process.env.BASE_URL;

// Function to delete images from the car folder

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(StatusCodes.OK).json({ cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Car not found" });
    }
    res.status(StatusCodes.OK).json({ car });
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createCar = async (req, res) => {
  try {
    const {
      carName,
      brand,
      price,
      youtubeVideo,
      color,
      Content,
      Passenger,
      GearShift,
      Door,
    } = req.body;
    const images = req.files.map(
      (file) => baseURL + "/uploads/car/" + file.filename
    ); // Add base URL to image paths

    const car = await Car.create({
      carName,
      brand,
      price,
      color,
      Content,
      Passenger,
      youtubeVideo,
      GearShift,
      Door,
      images,
    });

    res.status(StatusCodes.CREATED).json({ car });
  } catch (error) {
    console.error("Error creating car:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateCarById = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedCar = await Car.findById(id);

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update car properties if available in the request body
    if (req.body.carName) {
      updatedCar.carName = req.body.carName;
    }
    if (req.body.brand) {
      updatedCar.brand = req.body.brand;
    }
    if (req.body.price) {
      updatedCar.price = req.body.price;
    }
    if (req.body.color) {
      updatedCar.color = req.body.color;
    }
    if (req.body.content) {
      updatedCar.content = req.body.content;
    }
    if (req.body.passenger) {
      updatedCar.passenger = req.body.passenger;
    }
    if (req.body.gearShift) {
      updatedCar.gearShift = req.body.gearShift;
    }
    if (req.body.door) {
      updatedCar.door = req.body.door;
    }

    // Handle image update if available
    if (req.files && req.files.length > 0) {
      // Delete previous images
      if (updatedCar.images && updatedCar.images.length > 0) {
        updatedCar.images.forEach((image) => {
          // Extract filename from the URL
          const filename = image.split("/").pop();
          const imagePath = path.join(__dirname, "../uploads/car", filename);
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`Deleted previous image: ${imagePath}`);
            } else {
              console.log(`Previous image not found: ${imagePath}`);
            }
          } catch (error) {
            console.error(`Error deleting previous image: ${imagePath}`, error);
          }
        });
      }

      // Save new images
      const newImages = req.files.map(
        (file) => `${process.env.BASE_URL}/uploads/cars/${file.filename}`
      );
      updatedCar.images = newImages;
    }

    await updatedCar.save();

    res
      .status(200)
      .json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    console.error("Error updating car by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Car not found" });
    }

    // Delete images associated with the car
    await deleteCarImages(car.images);

    res.status(StatusCodes.OK).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car by ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteCarImages = async (images) => {
  if (images && images.length > 0) {
    const messages = [];
    images.forEach((image) => {
      try {
        const filename = image.split("/").pop(); // Extract filename from URL
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "car",
          filename
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          messages.push(`Image deleted successfully: ${filename}`);
        } else {
          messages.push(`File not found: ${filename}`);
        }
      } catch (error) {
        messages.push(`Error deleting image: ${error.message}`);
      }
    });
    return messages;
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCarById,
  deleteCarById,
};
