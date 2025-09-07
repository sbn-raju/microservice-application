const express = require("express");
const orderListing = require("../controllers/listing.controllers.js");
const validationRules = require("../utils/validationRules.utils.js");
const validateMiddleware = require("../middlewares/validator.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

const orderListingRoutes = express();


orderListingRoutes.post("/add-items", upload.array('item_imgs', 5), validationRules.itemValidationRules, validateMiddleware.validator, orderListing.addItems);

orderListingRoutes.get("/fetch-items", orderListing.fetchItems);

orderListingRoutes.put("/active-items", orderListing.activeItem);

module.exports = orderListingRoutes