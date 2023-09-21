const jwt = require("jsonwebtoken");
const auth = async (req,res,next)=>{
    try {
        //Extracting JWT token from request cookies,body or header
        const token =  req.header("Authorization").split(" ")[1];
        // const token = req.body.token || req.cookie.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message:"Token missing",success:false});
        };
        try {
            // verify the JWT token using secret key 
             const decode = await jwt.verify(token,process.env.token_key);
             console.log(decode,"");
            //  storing the decode JWT payload in request object for further use 
            req.user = decode;
        } catch (error) {
            return res.status(401).json({message:"Token is invalid",success:false});
        }
        // If JWT is valid, move on to the next middleware or request handler 
        next();
        
    } catch (error) {
        console.log(error.message)
        return res.status(401).json(
               {success:false,
               message:"Somthing went wrong when validating the token. Unautheorised access",
            });
    }
}

module.exports = {
    auth,
}