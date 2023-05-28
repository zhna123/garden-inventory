
require('dotenv').config()

const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator")

// Display a list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: Category list");
});

// Display detail page for a category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory, allCategories] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name price image_path").exec(),
    Category.find({}, 'name')
    .sort({ name: 1 })
    .exec(),
  ]);
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("index", {
    title: "Best Garden Inventory",
    category: category,
    item_list: itemsInCategory, 
    category_list: allCategories
  })
})

// Display category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {

  res.render("category_form", {
    title: "Best Garden Inventory",
  })
})

// Handle category create on POST
exports.category_create_post = [
  
  // validate and sanitize the name field
  body("name")
    .trim()
    .isLength({min: 3, max: 30})
    .escape()
    .withMessage("Category name must contain 3-30 characters"),

  body("description")
    .trim()
    .isLength({min: 1, max: 200})
    .escape()
    .withMessage("Category description must contain 3-200 characters"),

    // process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
      // extract validation errors from a request
      const errors = validationResult(req);

      // create Category object with escaped and trimmed data
      const category = new Category({
        name: req.body.name,
        description: req.body.description
      });

      if (!errors.isEmpty()) {
        // error - render again
        res.render("category_form", {
          title: "Best Garden Inventory",
          category: category,
          errors: errors.array()
        });
        return;
      } else {
        // check if category already existed
        const categoryExists = await Category.findOne({ name: req.body.name}).exec();
        if (categoryExists) {
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          res.redirect(category.url)
        }
      }
    })
]

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}, "name").exec(),
  ]);
  res.render("category_delete", {
    title: "Best Garden Inventory",
    category: category,
    category_items: allItemsInCategory
  })
})

// handle category delete on POST
exports.category_delete_post = asyncHandler(async(req, res, next) => {
  if (req.body.password && req.body.password === process.env.PASSWORD) {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/items")
  } else {
    res.send("wrong password")
  }
  
})

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err)
  }
  res.render("category_form", {
    title: "Best Garden Inventory",
    category: category,
  })
})

// Handle category update on POST
exports.category_update_post = [
  
  body("name")
    .trim()
    .isLength({min: 3, max: 30})
    .escape()
    .withMessage("Category name must contain 3-30 characters"),

  body("description")
    .trim()
    .isLength({min: 1, max: 200})
    .escape()
    .withMessage("Category description must contain 1-200 characters"),

    // process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // extract validation errors from a request
    const errors = validationResult(req);

    // create Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // error - render again
      res.render("category_form", {
        title: "Best Garden Inventory",
        category: category,
        errors: errors.array()
      });
    } else {
      const thecategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(thecategory.url)
    }
  })
]