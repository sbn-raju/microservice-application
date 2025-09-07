const { body } = require("express-validator");

module.exports.itemValidationRules = [
 body("name")
    .isString().withMessage("Item name must be a string")
    .notEmpty().withMessage("Item name should not be empty"),

  body("description")
    .isString().withMessage("Item description must be text")
    .notEmpty().withMessage("Item description should not be empty"),

  body("tag")
    .isString().withMessage("Item tag must be a string")
    .notEmpty().withMessage("Item tag should not be empty"),

  body("price")
    .isFloat({ min: 1 }).withMessage("Price must be a positive number"),

  body("quantity")
    .isNumeric({ min: 1 }).withMessage("Quantity must be a positive number"),

  body("category")
    .isString().withMessage("Item category must be text")
    .notEmpty().withMessage("Item category should not be empty"),

  body("subcategory")
    .isString().withMessage("Item sub-category must be text")
    .notEmpty().withMessage("Item sub-category should be not empty"),
]