const express = require("express");
const path = require('path');
const fs = require('fs');
const orderListingRoutes = require("./routes/listing.route");


const app = express();

//Making the middlwares to read the input from the request.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//This is to server the static files from the server.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/", orderListingRoutes);


const port = 8082;

app.listen(port, ()=>{
    console.log(`Order Listing service is running on the port: ${port}`)
})