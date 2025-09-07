const { body, validationResult } = require("express-validator");

//This middlewar will validate the errors.
module.exports.validator = async(req, res, next)=>{
    const errors = validationResult(req);
    console.log(req.body);

    //If the errors is empty then the request will go to the next point if not then it will returen it from here itself
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }

    //Next if the no errors found
    next()
}