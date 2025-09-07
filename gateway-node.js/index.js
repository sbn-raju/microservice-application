const express = require("express");
const expressProxy = require("express-http-proxy");


//Creating the gateway proxy.
const app = express();


app.use('/auth', expressProxy("http://localhost:8080"));

app.use('/orders', expressProxy("http://127.0.0.1:8081"));

app.use('/orders-listing', expressProxy("http://localhost:8082"));

app.use('/orders-placing', expressProxy("http://127.0.0.1:8083"));

const port = 8000;

app.listen(port, ()=>{
    console.log(`Application gateway server is running on port: ${port}`)
})