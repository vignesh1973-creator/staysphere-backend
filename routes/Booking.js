import {Router} from 'express';
import tokenValidator from '../middlewares/tokenValidator.js';
import HostValidator from '../middlewares/hostValidator.js';
import  {getMyBookingController,
                getBookingByIDController,
                getBookingOfHostListingsController,
                getBookingByHostListingIdController,
                createBookingController,
                updateBookingController,
                deleteBookingController
} from '../controllers/BookingController.js';

const router = Router();


router.use(tokenValidator)

// host listings ==> booking

router.get("/host/my-bookings", 
            HostValidator, 
            getBookingOfHostListingsController)


router.get("/host/listing/:id",
                HostValidator,
                getBookingByHostListingIdController)


router.get('/my-bookings', getMyBookingController)


router.get("/:id", getBookingByIDController)



router.post('/',createBookingController)

router.put("/:id",updateBookingController)

router.delete('/:id',deleteBookingController)







export default router;