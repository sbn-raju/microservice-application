const jwt = require("jsonwebtoken");

module.exports.accessTokenGenerator = (userDetails) => {
    //Getting the user details and making the accesstoken function.
    return jwt.sign(userDetails, process.env.ACCESS_TOKEN, 
        {
            expiresIn: '5m'
        }
    );
}


module.exports.refreshTokenGenerator = (userDetails) => {
    //Getting the user details and making the accesstoken function.
    return jwt.sign(userDetails, process.env.REFRESH_TOKEN, 
        {
            expiresIn: '5d'
        }
    );
}