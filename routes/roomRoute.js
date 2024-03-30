const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../middleware/authentication');
const roomController = require('../controller/roomController');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/room/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to create a new room
router.post('/', authenticateUser, upload.array('images', 6), roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id',roomController.getRoomById);
// Route to update a room by its ID
router.put('/:id', upload.array('images', 5), roomController.updateRoomById);
router.delete('/:id', roomController.deleteRoomById);

module.exports = router;
