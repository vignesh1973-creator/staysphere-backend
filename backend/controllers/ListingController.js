import asyncHandler from 'express-async-handler';
import Listing from '../models/Listing.js';
import {CreateListingSchema} from '../middlewares/Validator.js';


const getListingsController = asyncHandler(async(req,res)=>{
    const {location, maxprice, minprice, page=1, limit=10} = req.query

    const filter = {}

    if(location){
        filter.location = {
            $regex: location,
            $options: "i"
        }
    }

    if(minprice || maxprice){
        filter.price={}
    }

    if(minprice){
        filter.price.$gte = Number(minprice);
    }

    if(maxprice){
        filter.price.$lte = Number(maxprice);
    }

    const skip = (Number(page) - 1)* Number(limit)

    const totalItems = await Listing.countDocuments(filter)
    const totalPages = Math.ceil(totalItems/Number(limit));

    const listings = await Listing.find(filter)
                                  .select("title location price images")
                                  .skip(skip)
                                  .limit(Number(limit))

    res.status(200).json({
        success:true,
        listings,
        totalItems,
        totalPages,
        currentPage:Number(page),
        limit: Number(limit)
    })
                                  
})



const getListingByIdController = asyncHandler(async(req,res)=>{
    const id = req.params.id

    const listing = await Listing.findById(id)
                                 .populate("hostId", "email")

    if(!listing){
        const err = new Error("listing not found");
        err.status = 404;
        throw err;
    }

    res.status(200).json({
        success:true,
        listing
    })
})


const getListingByHostController = asyncHandler(async(req,res)=>{
    const {page = 1 , limit = 10} = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const skip = (pageNum -1)*limitNum;

    const totalItems = await Listing.countDocuments({hostId: req.user.id})

    const totalPages = Math.ceil(totalItems/limitNum)

    const listings = await Listing.find({hostId: req.user.id})
                                  .skip(skip)
                                  .limit(limitNum)
                                  .sort({createdAt: -1})

    res.status(200).json({
        success: true,
        listings,
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
    })
})



const createListingController = asyncHandler(async(req,res)=>{
        const {error , value} = CreateListingSchema.validate(req.body);

        if(error){
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err
        }

        const listing = await Listing.create({
            ...value,
            hostId: req.user.id
        })

        res.status(201).json({
            success: true,
            message:"Listing created successfully",
            listing
        })

})


const updateListingController = asyncHandler(async(req, res)=>{
    const id = req.params.id

    const existingListing = await Listing.findById(id);

    if(!existingListing){
        const err = new Error("Listing not found");
        err.status = 404;
        throw err;
    }

    if( existingListing.hostId.toString() !== req.user.id){
        const err = new Error("Only host to this Listing can updated")
        err.status = 403;
        throw err
    }

    const updateListing = await Listing.findByIdAndUpdate(id,
            req.body,
            {new: true,
             runValidators: true
            }
    )

    res.status(200).json({
        success:true,
        message:"Listing Updated successfully",
        updateListing
    })
})

const deleteListingController = asyncHandler(async(req,res)=>{
    const id = req.params.id

    const existingListing = await Listing.findById(id);

    if(!existingListing){
        const err = new Error("Listing not found")
        err.status = 404;
        throw err
    }

    if(existingListing.hostId.toString() !== req.user.id){
        const err = new Error("only this Listing Host can delete it ")
        err.status = 403;
        throw err
    }

    const deleteListing = await Listing.findByIdAndDelete(id)


    res.status(200).json({
        success:true,
        message:"Listing delete successfully"
    })
})



export {getListingsController , 
        getListingByIdController , 
        getListingByHostController , 
        createListingController, 
        updateListingController , 
        deleteListingController}