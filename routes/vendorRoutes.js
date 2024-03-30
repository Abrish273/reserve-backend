const express = require('express');
const router = express.Router();
const multer = require('multer');
const vendorController = require('../controller/vendorController');
const path = require('path');

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the fieldname to determine the destination folder
        if (file.fieldname === 'idCard') {
            cb(null, 'uploads/vendor/idcards');
        } else if (file.fieldname === 'tradeLicense') {
            cb(null, 'uploads/vendor/tradelicense');
        } else {
            // Default destination if fieldname doesn't match
            cb(null, 'uploads/vendor');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/register", upload.fields([
    { name: 'idCard', maxCount: 6 },
    { name: 'tradeLicense', maxCount: 6 }
]), vendorController.createVendor);


router.get("/", vendorController.getAllVendors);

router.get("/:id",  vendorController.getVendorById);


router.post("/login", vendorController.loginVendor);

router.put("/reject/:id",  vendorController.rejectVendorById);

router.put("/approve/:id",  vendorController.approveVendorById);

router.delete("/:id",  vendorController.deleteVendorById);


module.exports = router;
