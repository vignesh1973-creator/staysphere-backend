import mongoose  from "mongoose";



const BookingSchema = new mongoose.Schema({
    listingId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required : true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    checkIn: {
        type:Date,
        required: true
    },
    numberOfDays:{
        type:Number,
        required: true,
        min: 1
    },
    checkOut : {
        type: Date,
        required: true
    },

    totalPrice:{
        type: Number,
        required: true
    },

    status:{
        type:String,
        enum :["Booked", "Cancelled"],
        default:"Booked"
    }

},{timestamps:true})


export default mongoose.model("Booking", BookingSchema);