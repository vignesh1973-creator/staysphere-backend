import asyncHandler from 'express-async-handler';
import User from '../models/User.js';



const HostController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }

    if(user.isHost){
    return res.status(400).json({
        success:false,
        message:'Already a host'
    });
}

    user.isHost = true;
    await user.save();
   
    res.status(200).json({
        success:true,
        message:"You are now a host",
    })
})


export default HostController;