
require('dotenv').config()

const Item = require("../models/item");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator")
const multer  = require('multer')
const upload = multer({ dest: 'public/images/' })
let filePath = ''
let fileName = ''

// Display home page - a list of all items and all categories
exports.item_list = asyncHandler(async (req, res, next) => {
  const [allCategories, allItems] = await Promise.all([
    Category.find({}, 'name')
    .sort({ name: 1 })
    .exec(),
    Item.find({}, 'name price image_path')
    .sort({name: 1})
    .exec()
  ])

  res.render("index", {
    title: "Best Garden Inventory",
    category_list: allCategories,
    item_list: allItems
  })
});

// Display detail page for an item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  res.render("detail", {
    title: "Best Garden Inventory",
    item: item
  })
})

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // get all categories
  const allCategories = await Category.find().exec();
  res.render("item_form", {
    title: "Best Garden Inventory",
    categories: allCategories
  })
})

// Handle item create on POST
exports.item_create_post = [

  upload.single('uploaded_file'),

  (req, res, next) => {
    const file = req.file;
    if(!file) {
      const err = new Error("Please upload an image file");
      err.status = 404
      return next(err);
    }
    next()
  },

  body("name")
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage("Product name must contain 3-50 characters"),

  body("description")
    .trim()
    .isLength({min: 1, max: 300})
    .escape()
    .withMessage("Product description must contain 3-300 characters"),

  body("category")
    .isLength({min: 1})
    .escape()
    .withMessage("Must specify a category"),

  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price cannot be empty"),

  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Quantity cannot be empty"),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image_path: req.file.filename,
      original_name: req.file.originalname
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      
      res.render("item_form", {
        title: "Best Garden Inventory",
        categories: allCategories,
        item: item,
        errors: errors.array()
      })
    } else {
      await item.save();
      res.redirect(item.url)
    }
  })
]

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  res.render("item_delete", {
    title: "Best Garden Inventory",
    item: item
  })
})

// handle item delete on POST
exports.item_delete_post = asyncHandler(async(req, res, next) => {
  if (req.body.password && req.body.password === process.env.PASSWORD) {
    await Item.findByIdAndRemove(req.body.itemid);
    res.redirect("/catalog/items")
  } else {
    res.send("wrong password")
  }
})

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().exec()
  ]);
  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err)
  }
  res.render("item_form", {
    title: "Best Garden Inventory",
    categories: allCategories,
    item: item
  })
})

// Handle item update on POST
exports.item_update_post = [
  upload.single('uploaded_file'),

  (req, res, next) => {
    // if no new file uploaded, we use previous image file
    if (!req.file) {
      filePath = req.body.imagepath  
      fileName = req.body.imagename
    } else {
      // TODO delete the previous file
      filePath = req.file.filename
      fileName = req.file.originalname
    }
    next()
  },

  body("name")
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage("Product name must contain 3-50 characters"),

  body("description")
    .trim()
    .isLength({min: 1, max: 300})
    .escape()
    .withMessage("Product description must contain 3-300 characters"),

  body("category")
    .isLength({min: 1})
    .escape()
    .withMessage("Must specify a category"),

  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price cannot be empty"),

  body("quantity")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Quantity cannot be empty"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image_path: filePath,
      original_name: fileName,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();
      
      res.render("item_form", {
        title: "Best Garden Inventory",
        categories: allCategories,
        item: item,
        errors: errors.array()
      })
    } else {
      const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(theitem.url)
    }
  })
]