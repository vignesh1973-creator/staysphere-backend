import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import {hashPassword, comparePassword} from '../utils/helper.js';
import {SignupSchema, LoginSchema} from '../middlewares/Validator.js';
import { generateAccessToken,generateRefreshToken } from '../utils/token.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';


const SignupController = asyncHandler(async(req,res)=>{
    const {error, value} = SignupSchema.validate(req.body);

    if(error){
        const err = new Error(error.details[0].message);
        err.status = 400;
        throw err;
    }
    const {email, password} = value;

    const existingUser = await User.findOne({email})

    if(existingUser){
        const err = new Error("User already exists");
        err.status = 400;
        throw err;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        email,
        password: hashedPassword
    })

    const newProfile = await Profile.create({
        userId: newUser._id,
    })

    res.status(201).json({
        message: "User created successfully",
        user:{
            _id: newUser._id,
            email: newUser.email,
            isHost: newUser.isHost
        }
    })
})


const LoginController = asyncHandler(async(req,res)=>{

    const {error,value} = LoginSchema.validate(req.body);

    if(error){
        const err = new Error(error.details[0].message);
        err.status = 400;
        throw err;
    }

    const {email, password} = value;

    const existingUser = await User.findOne({email})

    if(!existingUser){
        const err = new Error("User does not exist");
        err.status = 400;
        throw err;
    }

    const isPasswordMatch = await comparePassword(password, existingUser.password);

    if(!isPasswordMatch){
        const err = new Error("Invalid Password");
        err.status = 400;
        throw err;
    }

    const existingProfile = await Profile.findOne({userId: existingUser._id});

    if(!existingProfile){
          const newProfile = await Profile.create({
        userId: existingUser._id,
       })
    }

    const accesstoken = generateAccessToken(existingUser._id);

    const refreshtoken = generateRefreshToken(existingUser._id);

    await RefreshToken.create({
        userId: existingUser._id,
        token: refreshtoken
    });

    const cookieOptions = {
           httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
    }

    res.cookie("accessToken",
                accesstoken,
                {
                    ...cookieOptions,
                    maxAge:15 * 60 * 1000
               }
    )

    res.cookie("refreshToken",
                refreshtoken,
                {
                    ...cookieOptions,
                     maxAge:7 * 24 * 60 * 60 * 1000
                }
    )

     res.status(200).json({
        message:"Login successful"
     })
})



const RefreshController = asyncHandler(async(req,res)=>{

    const refreshtoken = req.cookies.refreshToken;

    if(!refreshtoken){
        const err = new Error("token not found");
        err.status = 404;
        throw err
    }

    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET)

    const existingToken = await RefreshToken.findOne({
        token:refreshtoken
    })

    if(!existingToken){
        const err = new Error("Invalid refresh token");
        err.status = 401;
        throw err
    }

    const user = await User.findById(decoded.id)

    if(!user){
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const newAccessToken  = generateAccessToken(user._id);
    const newRefreshToken  = generateRefreshToken(user._id);

    await RefreshToken.deleteOne({
        token:refreshtoken
    })

    await RefreshToken.create({
        userId: user._id,
        token: newRefreshToken
    })

    const cookieOptions = {
        httpOnly: true,
        secure : process.env.NODE_ENV==='production',
        sameSite: 'lax'
    }

     res.cookie("accessToken",
                newAccessToken,
                {
                    ...cookieOptions,
                    maxAge:15 * 60 * 1000
               }
    )

    res.cookie("refreshToken",
                newRefreshToken,
                {
                    ...cookieOptions,
                     maxAge: 7 * 24 * 60 * 60 * 1000
                   
                }
    )


    res.status(200).json({
        success:true,
        message:"Token Refreshed successfully"
    })
})


const LogoutController = asyncHandler(async(req,res)=>{

    const refreshtoken = req.cookies.refreshToken;

    if(refreshtoken){

        await RefreshToken.deleteOne({
            token: refreshtoken
        })
    }


    res.clearCookie(
        "refreshToken"
    )

    res.clearCookie(
        "accessToken"
    )

    res.status(200).json({
        success:true,
        message:"User Logout Successfully"
    })
})



export {SignupController, LoginController, RefreshController , LogoutController};