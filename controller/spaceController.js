const Space = require('../model/spaceModels');
const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const baseURL = process.env.BASE_URL;

const createSpace = async (req, res) => {
    try {
      const { title, content, youtubeVideo, location, faqs, extraInformation, price } = req.body;
  
      // Destructure extra information fields
      const {
        numberOfBeds,
        numberOfBathrooms,
        squareLocation,
        realSpaceAddress,
        pricingTable,
        maxGuests
      } = extraInformation;
  
      // Check if files are included in the request
      if (!req.files || req.files.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No files uploaded' });
      }
  
      // Map uploaded image files to their URLs with base URL
      const images = req.files.map(
        (file) => baseURL + "/uploads/spaces/" + file.filename
      );
  
      // Create a new space object
      const space = new Space({
        title,
        content,
        location,
        youtubeVideo,
        price,
        faqs,
        images,
        extraInformation: {
          numberOfBeds,
          numberOfBathrooms,

          squareLocation,
          realSpaceAddress,
          pricingTable,
          maxGuests
        }
      });
  
      // Save the space to the database
      await space.save();
  
      // Send a success response
      res.status(StatusCodes.CREATED).json({ message: 'Space created successfully', space });
    } catch (error) {
      // Handle errors
      console.error('Error creating space:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  };
  
const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const space = await Space.findById(id);
    if (!space) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Space not found' });
    }
    res.status(StatusCodes.OK).json({ space });
  } catch (error) {
    console.error('Error fetching space by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const updateSpaceById = async (req, res) => {
    try {
      const { id } = req.params;
      const update = req.body;
      const space = await Space.findById(id);
  
      if (!space) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Space not found' });
      }
  
      // Update space properties if available
      if (update.title) {
        space.title = update.title;
      }
      if (update.content) {
        space.content = update.content;
      }
      if (update.youtubeVideo) {
        space.youtubeVideo = update.youtubeVideo;
      }
      if (update.faqs) {
        space.faqs = update.faqs;
      }
      if (update.extraInformation) {
        space.extraInformation = update.extraInformation;
      }
  
      // Handle image update if available
      if (req.files && req.files.length > 0) {
        // Extract base URL
        const baseURL = req.protocol + '://' + req.get('host');
  
        // Delete previous images
        if (space.extraInformation && space.extraInformation.images && space.extraInformation.images.length > 0) {
          space.extraInformation.images.forEach((image) => {
            // Extract filename from the URL
            const filename = image.split('/').pop();
            const imagePath = path.join(__dirname, '..', 'uploads', 'spaces', filename);
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
        space.extraInformation.images = req.files.map(file => `${baseURL}/uploads/spaces/${file.filename}`);
      }
  
      await space.save();
  
      res.status(StatusCodes.OK).json({ message: 'Space updated successfully', space });
    } catch (error) {
      console.error('Error updating space by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  };
  
const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(StatusCodes.OK).json({ spaces });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpace = await Space.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Space not found' });
    }

    // Delete images associated with the space
    await deleteSpaceImages(deletedSpace.images);

    res.status(StatusCodes.OK).json({ message: 'Space deleted successfully' });
  } catch (error) {
    console.error('Error deleting space by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteSpaceImages = async (images) => {
  try {
    images.forEach((image) => {
      const filename = path.basename(image);
      const imagePath = path.join(__dirname, '..', 'uploads', 'spaces', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  } catch (error) {
    console.error('Error deleting space images:', error);
  }
};

module.exports = { createSpace, getSpaceById, updateSpaceById, getAllSpaces, deleteSpaceById };
