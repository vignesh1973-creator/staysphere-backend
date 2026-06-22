import Profile from '../models/Profile.js';
import asyncHandler from 'express-async-handler';




const getProfileController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const existingProfile = await Profile.findOne({userId}).populate('userId', 'email isHost');

    if(!existingProfile){
        const err = new Error("Profile not found");
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        success: true,
        message:"profile fetched successfully",
        profile: existingProfile
    })
})


const updateProfileController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const existingProfile = await Profile.findOneAndUpdate({userId},
        req.body,
        {new:true}
    ).populate('userId', 'email isHost');

    if(!existingProfile){
        const err = new Error("Profile not found ");
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        success:true,
        message:"profile updated successfully",
        profile:existingProfile
    })
})

//not necessary 

const deleteProfileController = asyncHandler(async(req,res)=>{
    const userId = req.user.id;

    const existingProfile = await Profile.findOneAndDelete({userId});

    if(!existingProfile){
        const err = new Error("Profile not found");
        err.status = 404;
        throw err;
    }

    res.status(204).json({
        success:true,
        message:"profile deleted successfully"
    })
})



export {getProfileController, updateProfileController, deleteProfileController};