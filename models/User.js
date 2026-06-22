import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique: true
    },
    password:{
        type: String,
    },
    isHost:{
        type:Boolean,
        default: false
    }
})


export default mongoose.model('User', UserSchema);