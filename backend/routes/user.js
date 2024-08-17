const express = require("express");
const zod= require("zod");
const { User, Account } = require("../db");
const jwt= require("jsonwebtoken");
const { JWT_SECRET } = require("../config"); // Destructure JWT_SECRET property
const { authMiddleware } = require("../middlewares");
const router= express.Router();

//signup and signin routes
const signupSchema= zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
    
})
router.post("/signup",async(req,res)=>{
     const {success}= signupSchema.safeParse(req.body);
     if(!success){
        return res.status(411).json({
            msg:"Email already taken/incorrect inputs"
        })
     }

const existinguser= await User.findOne({username: req.body.username})

if(existinguser){ //chcek in mongoDB database
    return res.status(411).json({
        msg:"Email already taken"
    })
}
const user= await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
});

const userId= user._id;
// create new account with random balance
await Account.create({
    userId,
    balance: 1+ Math.random() *10000
})

//generate token 
const token= jwt.sign({
    userId
}, JWT_SECRET);

res.json({
    msg:"User created successfully",
    token:token}
)
})

//signin route
const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

//step 8 user routes
//to update data
const updateBody= zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})
router.put("/", authMiddleware, async(req,res)=>{
    const {success}= updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg:"Error while updating information"
        })
    }
    await User.updateOne(req.body,{id:req.userId});
    res.json({msg:"Updated successfully"});
})

//to get other users filterable by first or last name
router.get("/bulk",async(req,res)=>{
    const filter= req.query.filter || "";
    const users= await User.find({
        $or:[{ //to select either of two; firstname OR lastname
            firstName:{
                "$regex":filter} //syntax to do "like" searches in mongodb like we do in sql
            },{ 
                lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({ //only return the following fields to the frontend, DONT RETURN THE PASSWORD
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id: user._id
        }))
    })
})
module.exports= router;
