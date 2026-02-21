const jwt = require("jsonwebtoken");
const { request } = require("node:http");

async function identifyUser(req,res,next){
   // this is a middleware function which will be used to identify the user from the token and set the user id in the request object. This middleware will be used in all the protected routes.
  
   const token = req.cookies.token;;
    let decoded;
    if (!token) {
        return res.status(401).json({
            message: "No token provided. Please log in."
        });
    }
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // set the entire decoded token in the request object so that we can use it in the controllers to get the user id of the logged in user and also get the username of the logged in user.
        next(); // call the next middleware function or the controller function
      } catch (error) {
        return res.status(401).json({
            message: "Invalid token. Please log in again."
        });
    }   

    
}

module.exports = {
    identifyUser
}