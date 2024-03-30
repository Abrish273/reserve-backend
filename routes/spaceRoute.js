const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createSpace, getSpaceById, updateSpaceById, getAllSpaces, deleteSpaceById } = require('../controller/spaceController');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/spaces');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
router.post('/create', upload.array('images', 5), createSpace);
router.get('/:id', getSpaceById);
router.put('/:id', upload.array('images', 5), updateSpaceById);
router.get('/', getAllSpaces);
router.delete('/:id', deleteSpaceById);

module.exports = router;
