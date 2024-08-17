const {JWT_SECRET}= require("./config");
const jwt= require("jsonwebtoken");

//define middleware
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    //checks
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({});
    }

    //obtain token
    const token= authHeader.split(' ')[1];

    try{
        const decoded= jwt.verify(token, JWT_SECRET);
        
            req.userId= decoded.userId;
            next();
        }
        catch(err)
       {
            return res.status(403).json({});
        }   
};

module.exports={
    authMiddleware
}
