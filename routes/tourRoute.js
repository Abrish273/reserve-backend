const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const tourController = require('../controller/tourController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/tours');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });


// Route for creating a new tour
router.post('/create', upload.array('images', 5), tourController.createTour);

// Route for updating a tour by ID
router.put('/:id', upload.array('images', 5), tourController.updateTourById);

// Route for getting all tours
router.get('/', tourController.getAllTours);

// Route for getting a tour by ID
router.get('/:id', tourController.getTourById);

// Route for deleting a tour by ID
router.delete('/:id', tourController.deleteTourById);

module.exports = router;
