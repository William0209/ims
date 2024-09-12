// routes/productRoutes.js
const express = require("express");
const productController = require("../controllers/productController");

// Skapar en router för att hantera alla produktrelaterade endpoints
const router = express.Router();

// Hantera alla produkter (hämta alla eller skapa en ny)
router
  .route("/")
  .get(productController.getAllProducts) // Hämta alla produkter
  .post(productController.createProduct); // Skapa en ny produkt

// Hantera en specifik produkt via ID (hämta, uppdatera eller ta bort)
router
  .route("/:id")
  .get(productController.getProductById) // Hämta en produkt via ID
  .put(productController.updateProduct) // Uppdatera en produkt via ID
  .delete(productController.deleteProduct); // Ta bort en produkt via ID

// Extra routes för specifika funktioner
router.get(
  "/total-stock-value",
  productController.getTotalStockValue // Hämta totala lagervärdet
);
router.get(
  "/total-stock-value-by-manufacturer",
  productController.getTotalStockValueByManufacturer // Lagervärde per tillverkare
);
router.get(
  "/low-stock",
  productController.getLowStockProducts // Hämta produkter med låg lagerstatus
);
router.get(
  "/critical-stock",
  productController.getCriticalStockProducts // Hämta produkter med kritiskt lågt lager
);
router.get(
  "/manufacturers",
  productController.getManufacturers // Hämta alla tillverkare
);

module.exports = router; // Exporterar router för användning i appen
