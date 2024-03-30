const Boat = require('../model/boatModels');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const baseURL = process.env.BASE_URL;

const createBoat = async (req, res) => {
  const userId=req.user.userId;
  
  try {
    const {
      boatName,
      location,
      youtubeVideo,
      price,
      contentText,
      checkInTime,
      checkOutTime,
      boatPolicy
    } = req.body;

    // Construct image paths with base URL
    const pictures = req.files.map(file => baseURL + "/uploads/boat/" + file.filename);

    const newBoat = await Boat.create({
      boatName,
      location,
      price,
      images: pictures, // Use the constructed image paths
      contentText,
      checkInTime,
      checkOutTime,
      youtubeVideo,
      boatPolicy,
      user:userId
    });

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    res.status(StatusCodes.CREATED).json({ boat: newBoat });
  } catch (error) {
    console.error('Error creating boat:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const getAllBoats = async (req, res) => {
  try {
    const boats = await Boat.find();
    res.status(StatusCodes.OK).json({ boats });
  } catch (error) {
    console.error('Error getting boats:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

// Get boat by ID
const getBoatById = async (req, res) => {
  try {
    const { id } = req.params;
    const boat = await Boat.findById(id);
    if (!boat) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Boat not found' });
    }
    res.status(StatusCodes.OK).json({ boat });
  } catch (error) {
    console.error('Error getting boat by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};



// Update boat by ID
const updateBoatById = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedBoat = await Boat.findById(id);

    if (!updatedBoat) {
      return res.status(404).json({ error: "Boat not found" });
    }

    // Update boat properties if available
    if (req.body.boatName) {
      updatedBoat.boatName = req.body.boatName;
    }
    if (req.body.location) {
      updatedBoat.location = req.body.location;
    }
    if (req.body.price) {
      updatedBoat.price = req.body.price;
    }
    if (req.body.contentText) {
      updatedBoat.contentText = req.body.contentText;
    }
    if (req.body.checkInTime) {
      updatedBoat.checkInTime = req.body.checkInTime;
    }
    if (req.body.checkOutTime) {
      updatedBoat.checkOutTime = req.body.checkOutTime;
    }
    if (req.body.boatPolicy) {
      updatedBoat.boatPolicy = req.body.boatPolicy;
    }

    // Handle image update if available
    if (req.files && req.files.length > 0) {
      // Delete previous images
      if (updatedBoat.images && updatedBoat.images.length > 0) {
        updatedBoat.images.forEach((image) => {
          // Extract filename from the URL
          const filename = image.split("/").pop();
          const imagePath = path.join(
            __dirname,
            "..",
            "uploads",
            "boat",
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

      // Save new images
      updatedBoat.images = req.files.map((file) => file.filename);
    }

    await updatedBoat.save();

    res
      .status(200)
      .json({ message: "Boat updated successfully", boat: updatedBoat });
  } catch (error) {
    console.error("Error updating boat by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete boat by ID
const deleteBoatById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoat = await Boat.findByIdAndDelete(id);

    if (!deletedBoat) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Boat not found' });
    }

    // Delete images associated with the boat
    if (deletedBoat.images && deletedBoat.images.length > 0) {
      const messages = [];
      deletedBoat.images.forEach((image) => {
        try {
          const filename = image.split('/').pop(); // Extract filename from URL
          const imagePath = path.join(__dirname, '..', 'uploads', 'boat', filename);
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

      // Send response after loop completes
      if (messages.length > 0) {
        return res.status(StatusCodes.OK).json({ messages });
      }
    }

    // If no images or no errors occurred during deletion
    res.status(StatusCodes.OK).json({ message: 'Boat deleted successfully', boat: deletedBoat });
  } catch (error) {
    console.error('Error deleting boat by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


module.exports = { 
  createBoat, 
  getAllBoats,
  getBoatById,
  updateBoatById,
  deleteBoatById
};
