const Hotel = require("../model/hotelModels");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const baseURL = process.env.BASE_URL;

const createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      location,
      youtubeVideo,
      price,
      contentText,
      checkInTime,
      checkOutTime,
      hotelPolicy,
    } = req.body;

    // Map uploaded image files to their URLs with base URL
   // Replace with your actual base URL
    const images = req.files.map(
      (file) => baseURL + "/uploads/hotel/" + file.filename
    );

    const hotel = await Hotel.create({
      hotelName,
      location,
      youtubeVideo,
      price,
      contentText,
      checkInTime,
      checkOutTime,
      hotelPolicy,
      images, // Add images to the hotel object
    });

    res.status(StatusCodes.CREATED).json({ hotel });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(StatusCodes.OK).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Hotel not found" });
    }

    res.status(StatusCodes.OK).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Update hotel properties if available
    if (update.hotelName) {
      hotel.hotelName = update.hotelName;
    }
    if (update.location) {
      hotel.location = update.location;
    }
    if (update.price) {
      hotel.price = update.price;
    }
    if (update.contentText) {
      hotel.contentText = update.contentText;
    }
    if (update.checkInTime) {
      hotel.checkInTime = update.checkInTime;
    }
    if (update.checkOutTime) {
      hotel.checkOutTime = update.checkOutTime;
    }
    if (update.hotelPolicy) {
      hotel.hotelPolicy = update.hotelPolicy;
    }

    // Handle image update if available
    if (req.files && req.files.length > 0) {
      // Delete previous images
      if (hotel.images && hotel.images.length > 0) {
        hotel.images.forEach((image) => {
          // Extract filename from the URL
          const filename = image.split("/").pop();
          const imagePath = path.join(
            __dirname,
            "..",
            "uploads",
            "hotel",
            filename
          );
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

      // Save new images with base URL
      hotel.images = req.files.map(
        (file) => `${process.env.BASE_URL}/uploads/hotel/${file.filename}`
      );
    }

    await hotel.save();

    res.status(200).json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    console.error("Error updating hotel by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Hotel not found" });
    }

    // Delete images associated with the hotel
    await deleteHotelImages(deletedHotel.images);

    res.status(StatusCodes.OK).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel by ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteHotelImages = async (images) => {
  try {
    images.forEach((image) => {
      const filename = image.split("/").pop();
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "hotel",
        filename
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  } catch (error) {
    console.error("Error deleting hotel images:", error);
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
};
