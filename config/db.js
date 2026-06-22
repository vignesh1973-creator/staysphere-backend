import mongoose from 'mongoose';


export const ConnectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}