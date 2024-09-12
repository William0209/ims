// controllers/productController.js
const Product = require("../models/productModel");

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// GET a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "No product found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// POST a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// PUT (Update) a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "No product found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// DELETE a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "No product found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Total stock value
exports.getTotalStockValue = async (req, res) => {
  try {
    const products = await Product.find();
    const totalValue = products.reduce(
      (sum, product) =>
        sum + product.price * product.amountInStock,
      0
    );
    res.status(200).json({
      status: "success",
      data: {
        totalValue,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Total stock value by manufacturer
exports.getTotalStockValueByManufacturer = async (
  req,
  res
) => {
  try {
    const products = await Product.find();
    const totalByManufacturer = products.reduce(
      (acc, product) => {
        if (!acc[product.manufacturer.name]) {
          acc[product.manufacturer.name] = 0;
        }
        acc[product.manufacturer.name] +=
          product.price * product.amountInStock;
        return acc;
      },
      {}
    );

    res.status(200).json({
      status: "success",
      data: {
        totalByManufacturer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Low stock (less than 10 units)
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      amountInStock: { $lt: 10 },
    });
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Critical stock (less than 5 units)
exports.getCriticalStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      amountInStock: { $lt: 5 },
    }).select(
      "manufacturer.contact.name manufacturer.contact.phone manufacturer.contact.email"
    );
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Get all manufacturers
exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await Product.distinct(
      "manufacturer.name"
    );
    res.status(200).json({
      status: "success",
      data: {
        manufacturers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
