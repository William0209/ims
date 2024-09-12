// controllers/productController.js
const Product = require("../models/productModel");

// Hämta alla produkter
exports.getAllProducts = async (req, res) => {
  try {
    // Hämta alla produkter från databasen
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length, // Antalet produkter
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err, // Returnerar felmeddelande om något går fel
    });
  }
};

// Hämta en produkt via ID
exports.getProductById = async (req, res) => {
  try {
    // Hämta produkt baserat på ID från URL:en
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Ingen produkt hittades med det ID:t",
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

// Skapa en ny produkt
exports.createProduct = async (req, res) => {
  try {
    // Skapa och spara ny produkt i databasen
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct, // Returnerar den skapade produkten
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Uppdatera en produkt via ID
exports.updateProduct = async (req, res) => {
  try {
    // Uppdatera produkt med bodyn som skickats med i requesten
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returnerar den uppdaterade versionen av produkten
        runValidators: true, // Validerar data innan uppdatering
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Ingen produkt hittades med det ID:t",
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

// Ta bort en produkt via ID
exports.deleteProduct = async (req, res) => {
  try {
    // Hitta och ta bort produkt
    const product = await Product.findByIdAndDelete(
      req.params.id
    );
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Ingen produkt hittades med det ID:t",
      });
    }
    res.status(204).json({
      status: "success",
      data: null, // Returnerar nada innehåll vid borttagning
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Sammanlagda värdet av lager
exports.getTotalStockValue = async (req, res) => {
  try {
    const products = await Product.find();
    // Beräkna det totala värdet av alla produkter i lager
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

// Sammanlagda värdet av lager per tillverkare
exports.getTotalStockValueByManufacturer = async (
  req,
  res
) => {
  try {
    const products = await Product.find();
    // Gruppera och summera värdet av produkter per tillverkare
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

// Hämta produkter som är mindre än 10 i lager
exports.getLowStockProducts = async (req, res) => {
  try {
    // Hitta alla produkter med mindre än 10 enheter i lager
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

// Hämta produkter med kritiskt lågt lager (mindre än 5 enheter)
exports.getCriticalStockProducts = async (req, res) => {
  try {
    // Hitta produkter med mindre än 5 i lager och returnera endast kontaktinfo
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

// Hämta alla tillverkare
exports.getManufacturers = async (req, res) => {
  try {
    // Hämta unika namn på alla tillverkare från produkterna
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
