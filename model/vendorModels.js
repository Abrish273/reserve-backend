const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new mongoose.Schema({
  userName: { type: String,  required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String,  required: true },
  companyName:{ type:String, required:true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  idCard: {  
     type: [String],
    default: [],
    required: [true, "Please provide  images"]
   },
  tradeLicense: {   
    type: [String],
    default: [],
    required: [true, "Please provide  images"]
  },
  status: { type: String,enum:["Pending","Approved","Rejected"], default: 'Pending' }, 
});

const Vendor = mongoose.model('Vendor', vendorSchema,"Vendor");

module.exports = Vendor;



