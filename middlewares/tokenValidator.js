import jwt from 'jsonwebtoken';


const tokenValidator = (req,res,next)=>{
       try{

            //console.log(req.cookies);
            
            const token = req.cookies.accessToken 
            if(!token){
                const err = new Error("Token not found");
                err.status = 401;
                throw err;
            }
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            req.user = decoded;
            next();
       }
       catch(err){
           err.status = 401;
           next(err);
       }
}


export default tokenValidator;