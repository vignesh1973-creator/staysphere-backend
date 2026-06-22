import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {ConnectDB} from './config/db.js';
import ErrorHandler from './middlewares/ErrorHandler.js';
import authRoutes from './routes/Auth.js';
import ProfileRoutes from './routes/Profile.js';
import HostRoutes from './routes/User.js';
import ListingRoutes from './routes/Listing.js';
import BookingRoutes from './routes/Booking.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(cookieParser());
app.use(express.json());


ConnectDB();



app.use('/api/auth', authRoutes);
app.use('/api/profile', ProfileRoutes);
app.use('/api/users', HostRoutes);
app.use('/api/listings', ListingRoutes);
app.use('/api/bookings',BookingRoutes);



app.use(ErrorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})