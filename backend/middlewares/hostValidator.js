import User from '../models/User.js';
import asyncHandler from 'express-async-handler';


const HostValidator = asyncHandler(async(req,res,next)=>{
   
        const user = await User.findById(req.user.id);

        if(!user){
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

        if(!user.isHost){
            const err = new Error("User is not a host");
            err.status = 403;
            throw err;
        }
        next();
    
      
})


export default HostValidator;