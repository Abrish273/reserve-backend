const express = require('express');
const router = express.Router();
const multer = require('multer');
const boatController = require('../controller/boatController');
const path = require ('path')

const {
  authenticateUser,
  authorizePermissions,

}= require("../middleware/authentication")
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/boat/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to create a new boat
router.post('/', authenticateUser, upload.array('images', 6), boatController.createBoat);

// Route to get all boats
router.get('/', boatController.getAllBoats);

// Route to get a single boat by ID
router.get('/:id', boatController.getBoatById);

// Route to update a boat by ID


router.put('/:id', upload.array('images', 6), boatController.updateBoatById);

// Route to delete a boat by ID
router.delete('/:id', boatController.deleteBoatById);

module.exports = router;
