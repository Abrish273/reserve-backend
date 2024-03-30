const Vendor = require('../model/vendorModels.js');
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');


const baseURL = process.env.BASE_URL;

const createVendor = async (req, res) => {
  try {
      const { userName, firstName, lastName, phoneNumber, companyName, email, password, idCard, tradeLicense, status } = req.body;

      // Check if files are included in the request for ID cards
      if (!req.files || !req.files['idCard'] || req.files['idCard'].length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID card files uploaded' });
      }

      // Check if files are included in the request for trade licenses
      if (!req.files || !req.files['tradeLicense'] || req.files['tradeLicense'].length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No trade license files uploaded' });
      }

      // Map uploaded ID card image files to their URLs with base URL
      const idCardImages = req.files['idCard'].map(file => baseURL + "/uploads/vendor/idcards/" + file.filename);

      // Map uploaded trade license image files to their URLs with base URL
      const tradeLicenseImages = req.files['tradeLicense'].map(file => baseURL + "/uploads/vendor/tradelicense/" + file.filename);

      // Create a new vendor object
      const vendor = new Vendor({
          userName,
          firstName,
          lastName,
          phoneNumber,
          companyName,
          email,
          password,
          idCard: idCardImages,
          tradeLicense: tradeLicenseImages,
          status
      });

      // Save the vendor to the database
      await vendor.save();

      // Send a success response
      res.status(StatusCodes.CREATED).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
      // Handle errors
      console.error('Error creating vendor:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const getAllVendors = async (req, res) => {
    try {
        const vendor = await Vendor.find({});
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};





const loginVendor = async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await Vendor.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
     
      return res.status(200).send({ message: "Vendor Logged in", token,vendor:user });
    }
    res.status(400).send({ message: "Invalid Credentials" ,success:false});
  } catch (error) {
    return res.status(500).send({ message: error.message,success:false });
  }
}

const updateVendorById = async (req, res) => {
  try {
        const { id } = req.params;
        const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

      res.status(200).json({ vendor: updatedVendor });
  } catch (error) {
        res.status(500).json({ message: error.message });
  }
};



const approveVendorById = async (req, res) => {
  try {
        const { id } = req.params;
        const updatedVendor = await Vendor.findByIdAndUpdate(id, {status:"Approved"}, { new: true });

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

      res.status(200).json({ vendor: updatedVendor,message:"Vendor Approved Successfully" });
  } catch (error) {
        res.status(500).json({ message: error.message });
  }
};

const rejectVendorById = async (req, res) => {
  try {
        const { id } = req.params;
        const updatedVendor = await Vendor.findByIdAndUpdate(id, {status:"Rejected"}, { new: true });

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

      res.status(200).json({ vendor: updatedVendor,message:"Vendor Rejected Successfully" });
  } catch (error) {
        res.status(500).json({ message: error.message });
  }
};

const deleteVendorById = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedVendor = await Vendor.findByIdAndDelete(id);

      if (!deletedVendor) {
          return res.status(StatusCodes.NOT_FOUND).json({ error: 'Vendor not found' });
      }

      // Delete images associated with the vendor
      await deleteVendorImages(deletedVendor.idCard, deletedVendor.tradeLicense);

      res.status(StatusCodes.OK).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
      console.error('Error deleting vendor by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteVendorImages = async (idCardImages, tradeLicenseImages) => {
  try {
      const deleteImages = async (images, folder) => {
          images.forEach((image) => {
              const filename = path.basename(image);
              const imagePath = path.join(__dirname, '..', 'uploads', 'vendor', folder, filename);
              if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
              }
          });
      };

      await deleteImages(idCardImages, 'idcards');
      await deleteImages(tradeLicenseImages, 'tradelicense');
  } catch (error) {
      console.error('Error deleting vendor images:', error);
  }
};

const getVendorProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    loginVendor,
    updateVendorById,
    deleteVendorById,
   getVendorProfile,
   approveVendorById,
    rejectVendorById
};
