const jwt = require("jsonwebtoken");

module.exports.authenticateUser = (req, res, next) => {
  const token = req?.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ 
        success: false, 
        message: "Access token missing" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired access token" 
    });
  }
};


