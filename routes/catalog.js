const express = require("express");
const router = express.Router();

// require controller modules
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

// ********************** Item Routes ************************

// GET catalog home page
router.get("/", item_controller.item_list);

// GET request for creating an item.
// This must come before routes that display Item (uses id)
router.get("/item/create", item_controller.item_create_get);

// POST request for creating an item
router.post("/item/create", item_controller.item_create_post);

// GET request for deleting an item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete an item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update an item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update an item
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one item
router.get("/item/:id", item_controller.item_detail);

// GET request for a list of all items
router.get("/items", item_controller.item_list);

// *********************** Category Routes *********************

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id", category_controller.category_detail);

router.get("/categories", category_controller.category_list);


module.exports = router;