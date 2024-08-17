const express = require("express");
const cors= require("cors");
const mainRouter= require("./router/index")
const app = express();
//add cors middleware since our frontend and backend is on seperate routes

//always put app.use above your routes else they wont run
app.use(cors());
app.use(express.json()); //add body parser to read body in post requests
//ALSO NEED TO ADD AUTHENTICATION; ie:jwt

//routes
app.use("/api/v1", mainRouter);
app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)});
  
