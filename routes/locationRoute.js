const express = require("express");
const router = express.Router();
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} = require("../controller/locationController");

// Route to create a new location
router.post("/", createLocation);

// Route to get all locations
router.get("/", getAllLocations);

// Route to get a location by ID
router.get("/:id", getLocationById);

// Route to update a location
router.put("/:id", updateLocation);

// Route to delete a location
router.delete("/:id", deleteLocation);

module.exports = router;
