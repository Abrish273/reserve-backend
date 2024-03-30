const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  parent: { type: String },
  link: { type: String, required: true },
});

const locationCategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

const Location = mongoose.model('Location', locationSchema,"Location");
const LocationCategory = mongoose.model('LocationCategory', locationCategorySchema,"LocationCategory");

module.exports = { Location ,LocationCategory};



