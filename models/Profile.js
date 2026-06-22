import mongoose from 'mongoose';


const ProfileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    name:{
        type:String
    },
    gender:{
        type:String
    },
    phone:{
        type:String
    },
    bio:{
        type:String
    },
    location:{
        type:String
    },
    avatar:{
        type:String
    }

},{timestamps:true})


export default mongoose.model('Profile', ProfileSchema);