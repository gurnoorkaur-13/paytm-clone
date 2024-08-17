const express = require("express");
const {authMiddleware}= require('../middlewares')
const {Account}= require('../db');
const {default: mongoose}= require('mongoose');

const router= express.Router();

//account routes
//1. to see balance if user exists
router.get("/balance", authMiddleware, async (req, res) => {

      const account = await Account.findOne({ userId: req.userId });
      res.json({ balance: account.balance });
    }
  );
  
//2. to transfer money safely, ensuring atomic transactions
router.post("/transfer", authMiddleware, async (req,res)=>{
    const session= await mongoose.startSession(); //starts a session just like banks do irl
    session.startTransaction();
    const {amount, to}= req.body; //send in the body of your request amount of money and whom you wanna send it to

    //fetch the accounts within the transaction (in cuurent session)
    const account= await Account.findOne({ userId:req.userId}).session(session);

    //constraints
    if(!account || account.balance< amount){
        await session.abortTransaction();
        return res.status(400).json({message:"Insufficient balance"});
    }
    const toAccount= await Account.findOne({userId: to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({msg:"Invalid account"});
    }
    //if account valid, perform transaction
    await Account.updateOne({userId:req.userId},{$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance: amount}}).session(session);

    //commit tthe transaction
    await session.commitTransaction();
    res.json({msg:"Transfer successful"});
})

module.exports= router;
