// models/productModel.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Contact name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
});

const manufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Manufacturer name is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  website: String,
  description: String,
  address: String,
  contact: contactSchema, // Embed Contact schema here
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
  },
  description: String,
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  category: String,
  amountInStock: Number,
  manufacturer: manufacturerSchema, // Embed Manufacturer schema here
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
