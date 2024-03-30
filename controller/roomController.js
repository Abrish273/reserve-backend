const Room = require('../model/roomModels');
const Hotel = require('../model/hotelModels');
const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const baseURL = process.env.BASE_URL;


const createRoom = async (req, res) => {
  try {
      const {
          hotelId,
          title,
          youtubeVideo,
          price,
          numberOfRooms,
          numberOfBeds,
          maxOccupancy,
          acreage
      } = req.body;

      // Check if images are provided
      if (!req.files || req.files.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No files uploaded' });
      }

      // Check if the hotel exists and populate hotel data
      const hotel = await Hotel.findById(hotelId).select('name images'); // Select only name and images fields
      if (!hotel) {
          return res.status(StatusCodes.NOT_FOUND).json({ error: 'Hotel not found' });
      }

      // Map uploaded image files to their URLs with base URL and store in "rooms" folder
      const images = req.files.map(
        (file) => baseURL + "/uploads/room/" + file.filename
      );
  
      const room = new Room({
          hotel: {
              _id: hotel._id,
              name: hotel.name,
              images: hotel.images
          },
          title,
          youtubeVideo,
          images,
          price,
          numberOfRooms,
          numberOfBeds,
          maxOccupancy,
          acreage
      });

      await room.save();

      res.status(StatusCodes.CREATED).json({ message: 'Room created successfully', room });
  } catch (error) {
      console.error('Error creating room:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};



const getAllRooms = async (req, res) => {
  try {
    // Fetch all rooms from the database, populate the 'hotel' field to include additional hotel data
    const rooms = await Room.find().populate('hotel', 'hotelName location images');

    res.status(StatusCodes.OK).json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id; // Get the room ID from the request parameters

    // Find the room by ID in the database and populate the 'hotel' field to include hotel information
    const room = await Room.findById(roomId).populate('hotel', 'hotelName location images');

    if (!room) {
      // If room is not found, return a not found error
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Room not found' });
    }

    res.status(StatusCodes.OK).json({ room });
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};
const updateRoomById = async (req, res) => {
  try {
      const { id } = req.params;
      const update = req.body;
      const room = await Room.findById(id);

      if (!room) {
          return res.status(StatusCodes.NOT_FOUND).json({ error: 'Room not found' });
      }

      // Update room properties if available
      if (update.title) {
          room.title = update.title;
      }
      if (update.youtubeVideo) {
          room.youtubeVideo = update.youtubeVideo;
      }
      if (update.price) {
          room.price = update.price;
      }
      if (update.numberOfRooms) {
          room.numberOfRooms = update.numberOfRooms;
      }
      if (update.numberOfBeds) {
          room.numberOfBeds = update.numberOfBeds;
      }
      if (update.maxOccupancy) {
          room.maxOccupancy = update.maxOccupancy;
      }
      if (update.acreage) {
          room.acreage = update.acreage;
      }

      // Handle image update if available
      if (req.files && req.files.length > 0) {
          const baseURL = req.protocol + '://' + req.get('host');

          // Delete previous images
          if (room.images && room.images.length > 0) {
              room.images.forEach((image) => {
                  const filename = image.split('/').pop();
                  const imagePath = path.join(__dirname, '..', 'uploads', 'room', filename);
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
          room.images = req.files.map(file => `${baseURL}/uploads/room/${file.filename}`);
      }

      await room.save();

      res.status(StatusCodes.OK).json({ message: 'Room updated successfully', room });
  } catch (error) {
      console.error('Error updating room by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Room not found' });
    }

    // Delete images associated with the room
    await deleteRoomImages(deletedRoom.images);

    res.status(StatusCodes.OK).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteRoomImages = async (images) => {
  try {
    images.forEach((image) => {
      const filename = path.basename(image);
      const imagePath = path.join(__dirname, '..', 'uploads', 'room', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image: ${imagePath}`);
      }
    });
  } catch (error) {
    console.error('Error deleting room images:', error);
  }
};





    module.exports = {
      createRoom,
      getAllRooms,
      getRoomById, 
      updateRoomById,
      deleteRoomById   
    };