const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const hotelController = require("../controller/HotelController");

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/hotel");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create a new hotel
router.post("/", upload.array("images", 6), hotelController.createHotel);

// Get all hotels
router.get("/", hotelController.getAllHotels);

// Get a hotel by ID
router.get("/:id", hotelController.getHotelById);

// Update a hotel by ID
router.put("/:id", upload.array("images", 6), hotelController.updateHotelById);

// Delete a hotel by ID
router.delete("/:id", hotelController.deleteHotelById);

module.exports = router;
