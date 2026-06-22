import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    location:{
        type:String
    },
    images:[{
        type:String
    }],
    price:{
        type:Number,
        required:true
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
},{timestamps:true})


export default mongoose.model('Listing', ListingSchema);