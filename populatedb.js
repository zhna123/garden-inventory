#! /usr/bin/env node

console.log(
  'This script populates some test category and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, quantity) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    quantity: quantity
  };

  const item = new Item(itemdetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Plants", "Plants category"),
    categoryCreate("Garden Supply", "Garden Supply category"),
    categoryCreate("Outdoor Decorations", "Outdoor Decorations category"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  categories.sort(); // 0 - garden supply, 1 - outdoor, 2 - plant

  await Promise.all([
    itemCreate(
      "Tomato",
      "Best Tomato",
      categories[2],
      "$5.99",
      20
    ),
    itemCreate(
      "Bell pepper",
      "Best Bell pepper",
      categories[2],
      "$7.99",
      30
    ),
    itemCreate(
      "Peach",
      "Best Peach",
      categories[2],
      "$10.99",
      10
    ),
    itemCreate(
      "Pruner",
      "Best Pruner",
      categories[0],
      "$9.20",
      20
    ),
    itemCreate(
      "Watering can",
      "Best Watering can",
      categories[0],
      "$8.79",
      30
    ),
    itemCreate(
      "Umbrella",
      "Best Umbrella",
      categories[1],
      "$39.99",
      10
    ),
    itemCreate(
      "Wind chime",
      "Best Wind chime",
      categories[1],
      "$7.65",
      50
    ),
  ]);
}