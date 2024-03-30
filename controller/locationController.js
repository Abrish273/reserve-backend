const mongoose = require("mongoose");
const { Location, LocationCategory } = require("../model/locationModel");
const { StatusCodes } = require("http-status-codes");

// Controller function to create a new location
const createLocation = async (req, res) => {
  try {
    const { name, parent, link } = req.body;

    // Create a new location object
    const location = new Location({ name, parent, link });

    // Save the location to the database
    await location.save();

    // Send a success response
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Location created successfully", location });
  } catch (error) {
    // Handle errors
    console.error("Error creating location:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Controller function to get all locations
const getAllLocations = async (req, res) => {
  try {
    // Retrieve all locations from the database
    const locations = await Location.find();

    // Send the locations as a response
    res.status(StatusCodes.OK).json(locations);
  } catch (error) {
    // Handle errors
    console.error("Error getting locations:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Controller function to get a location by ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the location by ID from the database
    const location = await Location.findById(id);

    // If location is not found, send a not found response
    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Location not found" });
    }

    // Send the location as a response
    res.status(StatusCodes.OK).json(location);
  } catch (error) {
    // Handle errors
    console.error("Error getting location by ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Controller function to update a location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent, link } = req.body;

    // Find the location by ID and update its properties
    const location = await Location.findByIdAndUpdate(
      id,
      { name, parent, link },
      { new: true }
    );

    // If location is not found, send a not found response
    if (!location) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Location not found" });
    }

    // Send the updated location as a response
    res
      .status(StatusCodes.OK)
      .json({ message: "Location updated successfully", location });
  } catch (error) {
    // Handle errors
    console.error("Error updating location:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Controller function to delete a location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the location by ID and delete it
    const deletedLocation = await Location.findByIdAndDelete(id);

    // If location is not found, send a not found response
    if (!deletedLocation) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Location not found" });
    }

    // Send a success response
    res
      .status(StatusCodes.OK)
      .json({ message: "Location deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting location:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};
