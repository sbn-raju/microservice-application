const express = require("express");
const userAuthRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const { connectToDatabase } = require("./database/db.connection.js");
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');



const app = express();

//Making the middlwares to read the input from the request.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//This is to server the static files from the server.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Middleware to pares the cookies.
app.use(cookieParser());

//This home route for authentication and all the other stuff like register and login, logout.
app.use('/', userAuthRoutes);

//This route will used for doing crud operation of the user account.
app.use('/user', userRoutes); 


// //Connecting to the database.
// connectToDatabase();

const port = 8080;

app.listen(port,()=>{
    console.log(`Node.js authentication service is running on the port: ${port}`)
})