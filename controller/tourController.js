const Tour = require('../model/TourModels');
const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');


const baseURL = process.env.BASE_URL;

const createTour = async (req, res) => {
    try {
        const {
            title,
            content,
            category,
            youtubeVideo,
            duration,
            tourNumberPerson,
            faqs,
            location,
            realTourAddress,
            fixedPrice,
            priceByTypeOfPerson,
            extraService,
            availabilityCalendar,
        } = req.body;

        // Check if files are included in the request
        if (!req.files || req.files.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No files uploaded' });
        }

        // Map uploaded image files to their URLs with base URL
        const images = req.files.map(
            (file) => baseURL + "/uploads/tours/" + file.filename
        );

        // Create a new tour object
        const tour = new Tour({
            title,
            content,
            category,
            youtubeVideo,
            duration,
            tourNumberPerson,
            faqs,
            location,
            realTourAddress,
            fixedPrice,
            priceByTypeOfPerson,
            extraService,
            availabilityCalendar,
            images
        });

        // Save the tour to the database
        await tour.save();

        // Send a success response
        res.status(StatusCodes.CREATED).json({ message: 'Tour created successfully', tour });
    } catch (error) {
        // Handle errors
        console.error('Error creating tour:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getAllTours = async (req, res) => {
    try {
      const tours = await Tour.find();
      res.status(StatusCodes.OK).json(tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
  
  const getTourById = async (req, res) => {
    try {
      const { id } = req.params;
      const tour = await Tour.findById(id);
  
      if (!tour) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Tour not found" });
      }
  
      res.status(StatusCodes.OK).json(tour);
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  const updateTourById = async (req, res) => {
    try {
      const { id } = req.params;
      const update = req.body;
      const tour = await Tour.findById(id);
  
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
  
      // Update tour properties if available
      if (update.title) {
        tour.title = update.title;
      }
      if (update.content) {
        tour.content = update.content;
      }
      if (update.category) {
        tour.category = update.category;
      }
      if (update.youtubeVideo) {
        tour.youtubeVideo = update.youtubeVideo;
      }
      if (update.duration) {
        tour.duration = update.duration;
      }
      if (update.tourNumberPerson) {
        tour.tourNumberPerson = update.tourNumberPerson;
      }
      if (update.faqs) {
        tour.faqs = update.faqs;
      }
      if (update.location) {
        tour.location = update.location;
      }
      if (update.realTourAddress) {
        tour.realTourAddress = update.realTourAddress;
      }
      if (update.fixedPrice) {
        tour.fixedPrice = update.fixedPrice;
      }
      if (update.priceByTypeOfPerson) {
        tour.priceByTypeOfPerson = update.priceByTypeOfPerson;
      }
      if (update.extraService) {
        tour.extraService = update.extraService;
      }
      if (update.availabilityCalendar) {
        tour.availabilityCalendar = update.availabilityCalendar;
      }
  
      // Handle image update if available
      if (req.files && req.files.length > 0) {
        // Delete previous images
        if (tour.images && tour.images.length > 0) {
          tour.images.forEach((image) => {
            // Extract filename from the URL
            const filename = image.split("/").pop();
            const imagePath = path.join(
              __dirname,
              "..",
              "uploads",
              "tours",
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
        tour.images = req.files.map(
          (file) => `${process.env.BASE_URL}/uploads/tours/${file.filename}`
        );
      }
  
      await tour.save();
  
      res.status(200).json({ message: "Tour updated successfully", tour });
    } catch (error) {
      console.error("Error updating tour by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const deleteTourById = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTour = await Tour.findByIdAndDelete(id);
  
      if (!deletedTour) {
        return res.status(404).json({ error: "Tour not found" });
      }
  
      // Delete images associated with the tour
      await deleteTourImages(deletedTour.images);
  
      res.status(200).json({ message: "Tour deleted successfully" });
    } catch (error) {
      console.error("Error deleting tour by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const deleteTourImages = async (images) => {
    try {
      images.forEach((image) => {
        const filename = image.split("/").pop();
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "tours",
          filename
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    } catch (error) {
      console.error("Error deleting tour images:", error);
    }
  };
  
  

module.exports ={
    createTour,
    getAllTours, 
    getTourById,
    updateTourById,
    deleteTourById,

}
