// routes/productRoutes.js
const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

// Additional routes
router.get(
  "/total-stock-value",
  productController.getTotalStockValue
);
router.get(
  "/total-stock-value-by-manufacturer",
  productController.getTotalStockValueByManufacturer
);
router.get(
  "/low-stock",
  productController.getLowStockProducts
);
router.get(
  "/critical-stock",
  productController.getCriticalStockProducts
);
router.get(
  "/manufacturers",
  productController.getManufacturers
);

module.exports = router;
