const express= require("express");
const userRouter= require("./user");
const accountRouter= require("./account");

const router= express.Router();
 
 //  /api/v1/user
 //  /api/v1/transaction...

 router.use("/user", userRouter)
 router.use("/account",accountRouter)

 module.exports= router;
