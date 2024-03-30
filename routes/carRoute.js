const express = require('express');
const router = express.Router();
const multer = require('multer');
const carController = require('../controller/carController');
const path =require ('path')

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/vendor');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', upload.array('images', 6), carController.createCar);
router.put('/:id', upload.array('images', 6), carController.updateCarById);
router.delete('/:id', carController.deleteCarById);

module.exports = router;
