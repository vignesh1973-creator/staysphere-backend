import asyncHandler from 'express-async-handler';
import {CreateBookingSchema , UpdateBookingSchema} from '../middlewares/Validator.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';



const getMyBookingController = asyncHandler(async(req,res)=>{

    const {page = 1, limit = 10 , status , location} = req.query;


    const bookingFilter = {
        userId : req.user.id
    } 

    if(status){
        bookingFilter.status = status
    }

    
    let bookings = await Booking.find(bookingFilter)
    .populate("listingId", "title price location images")
    .sort({createdAt: -1})

    if(location){
        bookings = bookings.filter(
            booking => 
                booking.listingId &&
                booking.listingId.location
                    .toLowerCase()
                    .includes(location.toLowerCase())
        )
    }

    const pageNum = Number(page)
    const limitNum = Number(limit);

    const skip = (pageNum -1)*limitNum

    const totalItems = bookings.length

    const totalPages = Math.ceil(totalItems/limitNum);

    const paginatedBookings = bookings.slice(
        skip,
        skip + limitNum
    )


    res.status(200).json({
        success: true,
        bookings: paginatedBookings,
        totalItems,
        totalPages,
        currentPage:pageNum,
        limit:limitNum
    })
})

const getBookingByIDController = asyncHandler(async(req,res)=>{
    const id = req.params.id;

    const booking = await Booking.findById(id)
                                        .populate("listingId", "title description location price images");
    
    if(!booking){
        const err = new Error("Booking not found")
        err.status= 404;
        throw err
    }

    if(booking.userId.toString() !== req.user.id){
        const err = new Error("This booking does not belong to the user ")
        err.status= 403;
        throw err;
    }

    res.status(200).json({
        success:true,
        message:"Booking information",
        booking 
    })
})


const getBookingOfHostListingsController  = asyncHandler(async(req,res)=>{

    const {page = 1 , limit = 10} = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const skip = (pageNum - 1)*limitNum;

    const listings = await Listing.find({
        hostId: req.user.id
    }).select('_id')

    const listingIds = listings.map(
        listing => listing._id
    )

    const totalItems = await Booking.countDocuments({
        listingId : {
            $in : listingIds
        }
    })

    const totalPages = Math.ceil(totalItems/limitNum);

    const bookings = await Booking.find({
        listingId:{
            $in: listingIds
        }
    })
    .populate(
        "listingId",
        "title location price"
    )
    .populate(
        "userId",
        "email"
    )
    .skip(skip)
    .limit(limitNum)
    .sort({createdAt: -1})

    res.status(200).json({
        success:true,
        bookings,
        totalItems,
        totalPages,
        currentPage:pageNum,
        limitNum
    })
})

const getBookingByHostListingIdController = asyncHandler(async(req,res)=>{
    const id = req.params.id

    const listing = await Listing.findById(id)

    if(!listing){
        const err = new Error("Listing not found");
        err.status = 404;
        throw err
    }

    if(listing.hostId.toString() !== req.user.id){
        const err = new Error("This Listing is not belong to this user");
        err.status = 403;
        throw err;
    }

    const bookings = await Booking.find({
        listingId : id
    }).populate("userId", "email")

    res.status(200).json({
        success: true,
        listing:{
           id : listing._id,
           title: listing.title,
           description : listing.description,
           price : listing.price
        },
        bookingsCount : bookings.length,
        bookings
    })
})

const createBookingController = asyncHandler(async(req,res)=>{

        const{error, value} = CreateBookingSchema.validate(req.body)

        if(error){
            const err = new Error(error.details[0].message);
            err.status = 400;
            throw err;
        }

        const {listingId, checkIn, numberOfDays} = value

        const checkOut = new Date(checkIn);

        checkOut.setDate(
            checkOut.getDate() + numberOfDays
        )

    const existingListing = await Listing.findById( listingId);

    if(!existingListing){
        const err = new Error("Listing not found");
        err.status = 404;
        throw err
    }

    if(existingListing.hostId.toString() === req.user.id){
        const err = new Error("You cannot book your own listing");
        err.status=400;
        throw err
    }

    const overlappingBooking = await Booking.findOne({
        listingId,
        status:"Booked",
        checkIn:{$lt : checkOut},
        checkOut:{$gt: checkIn}
    })

    if(overlappingBooking){
        const err= new Error("Property is already booked for the selected dates");
        err.status =400;
        throw err

    }

    const totalPrice = existingListing.price * numberOfDays

    const booking = await Booking.create({
        listingId,
        userId: req.user.id,
        checkIn,
        numberOfDays,
        checkOut,
        totalPrice,
    })

    res.status(201).json({
        success : true,
        message:"booking created successfully",
        booking
    })
})

const updateBookingController = asyncHandler(async(req,res)=>{

    const {error , value} = UpdateBookingSchema.validate(req.body)

    if(error){
        const err = new Error(error.details[0].message)
        err.status=400;
        throw err
    }


    const id = req.params.id

      const booking = await Booking.findById(id);
    
    if(!booking){
        const err = new Error("Booking not found")
        err.status= 404;
        throw err
    }

    if(booking.userId.toString() !== req.user.id){
        const err = new Error("This booking does not belong to the user ")
        err.status= 403;
        throw err;
    }

    if(booking.status === 'Cancelled'){
        const err = new Error("Cancelled bookings cannot be updated");
        err.status = 400;
        throw err
    }

    const checkIn = value.checkIn || booking.checkIn

    const numberOfDays = value.numberOfDays || booking.numberOfDays

    const checkOut = new Date(checkIn)

    checkOut.setDate(
        checkOut.getDate() + numberOfDays
    )

    const overlappingBooking = await Booking.findOne({
        _id: {$ne : id},
        listingId : booking.listingId,
        status : "Booked",
        checkIn : {$lt: checkOut},
        checkOut: {$gt: checkIn}
    })

    if(overlappingBooking){
        const err = new Error("Property is already booked for selected dates")
        err.status = 409;
        throw err;
    }

    const listing = await Listing.findById(booking.listingId)

    const totalPrice = listing.price * numberOfDays

    booking.checkIn = checkIn;
    booking.numberOfDays = numberOfDays;
    booking.checkOut = checkOut;
    booking.totalPrice = totalPrice

    await booking.save()

    res.status(200).json({
        success:true,
        message:"Booking updated successfully",
        booking
    })
})


const deleteBookingController = asyncHandler(async(req,res)=>{
    const id = req.params.id

      const booking = await Booking.findById(id);
    
    if(!booking){
        const err = new Error("Booking not found")
        err.status= 404;
        throw err
    }

    if(booking.userId.toString() !== req.user.id){
        const err = new Error("This booking does not belong to the user ")
        err.status= 403;
        throw err;
    }

    booking.status = 'Cancelled';
    await booking.save()

    res.status(200).json({
        success:true,
        message:"Booking Cancelled successfully"
    })

})



export  {getMyBookingController,
                getBookingByIDController,
                getBookingOfHostListingsController,
                getBookingByHostListingIdController,
                createBookingController,
                updateBookingController,
                deleteBookingController
}