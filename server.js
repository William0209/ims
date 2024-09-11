const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

// MongoDB Connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection success"))
  .catch((err) => console.error("DB connection error:", err));

// Mongoose Models (Example)
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const manufacturerSchema = new mongoose.Schema({
  name: String,
  country: String,
  website: String,
  description: String,
  address: String,
  contact: contactSchema,
});

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  description: String,
  price: Number,
  category: String,
  manufacturer: manufacturerSchema,
  amountInStock: Number,
});

const Product = mongoose.model("Product", productSchema);

// GraphQL Schema
const schema = buildSchema(`
  type Contact {
    name: String
    email: String
    phone: String
  }

  type Manufacturer {
    name: String
    country: String
    website: String
    description: String
    address: String
    contact: Contact
  }

  type Product {
    id: ID
    name: String
    sku: String
    description: String
    price: Float
    category: String
    manufacturer: Manufacturer
    amountInStock: Int
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    totalStockValue: Float
    totalStockValueByManufacturer: [StockValueByManufacturer]
    lowStockProducts: [Product]
    criticalStockProducts: [CriticalStockProduct]
    manufacturers: [Manufacturer]
  }

  type StockValueByManufacturer {
    manufacturer: String
    totalValue: Float
  }

  type CriticalStockProduct {
    name: String
    manufacturerName: String
    contactName: String
    contactPhone: String
    contactEmail: String
  }

  type Mutation {
    addProduct(name: String!, sku: String!, description: String!, price: Float!, category: String!, manufacturer: ManufacturerInput!, amountInStock: Int!): Product
    updateProduct(id: ID!, name: String, sku: String, description: String, price: Float, category: String, manufacturer: ManufacturerInput, amountInStock: Int): Product
    deleteProduct(id: ID!): Product
  }

  input ContactInput {
    name: String
    email: String
    phone: String
  }

  input ManufacturerInput {
    name: String
    country: String
    website: String
    description: String
    address: String
    contact: ContactInput
  }
`);

// GraphQL Resolvers
const root = {
  products: async () => {
    return await Product.find();
  },
  product: async ({ id }) => {
    return await Product.findById(id);
  },
  totalStockValue: async () => {
    const products = await Product.find();
    return products.reduce((total, product) => total + (product.price * product.amountInStock), 0);
  },
  totalStockValueByManufacturer: async () => {
    const products = await Product.aggregate([
      {
        $group: {
          _id: "$manufacturer.name",
          totalValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
        }
      }
    ]);
    return products.map(p => ({
      manufacturer: p._id,
      totalValue: p.totalValue
    }));
  },
  lowStockProducts: async () => {
    return await Product.find({ amountInStock: { $lt: 10 } });
  },
  criticalStockProducts: async () => {
    const products = await Product.find({ amountInStock: { $lt: 5 } });
    return products.map(product => ({
      name: product.name,
      manufacturerName: product.manufacturer.name,
      contactName: product.manufacturer.contact.name,
      contactPhone: product.manufacturer.contact.phone,
      contactEmail: product.manufacturer.contact.email,
    }));
  },
  manufacturers: async () => {
    const products = await Product.find();
    return [...new Set(products.map(product => product.manufacturer))];
  },
  addProduct: async ({ name, sku, description, price, category, manufacturer, amountInStock }) => {
    const product = new Product({ name, sku, description, price, category, manufacturer, amountInStock });
    return await product.save();
  },
  updateProduct: async ({ id, ...rest }) => {
    return await Product.findByIdAndUpdate(id, rest, { new: true });
  },
  deleteProduct: async ({ id }) => {
    return await Product.findByIdAndDelete(id);
  }
};

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,  // Enable GraphiQL interface
}));

// Start the Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`);
});
