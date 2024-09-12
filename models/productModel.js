// models/productModel.js
const mongoose = require("mongoose");

// Kontaktinformation för tillverkaren
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kontaktnamn krävs"], // Namn på kontaktpersonen
  },
  email: {
    type: String,
    required: [true, "Email krävs"], // Kontaktens e-postadress
  },
  phone: {
    type: String,
    required: [true, "Telefonnummer krävs"], // Kontaktens telefonnummer
  },
});

// Information om tillverkaren
const manufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tillverkarens namn krävs"], // Namn på tillverkaren
  },
  country: {
    type: String,
    required: [true, "Land krävs"], // Var tillverkaren kommer ifrån
  },
  website: String, // Webbsida, inte obligatorisk
  description: String, // Lite extra info om tillverkaren
  address: String, // Adress för tillverkaren
  contact: contactSchema, // Kontaktinfo ligger inbäddad här (se ovan)
});

// Information om produkten
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Produktnamn krävs"], // Namn på produkten
  },
  sku: {
    type: String,
    required: [true, "SKU krävs"], // Produktens unika identifierare (SKU)
  },
  description: String, // En beskrivning av produkten
  price: {
    type: Number,
    required: [true, "Pris krävs"], // Produktens pris
  },
  category: String, // Kategori som produkten tillhör, valfri
  amountInStock: Number, // Hur många produkter som finns i lager
  manufacturer: manufacturerSchema, // Tillverkaren inbäddad här
});

// Skapar en Product-modell baserad på schemat
const Product = mongoose.model("Product", productSchema);

module.exports = Product; // Exporterar modellen så den kan användas i andra delar av appen
