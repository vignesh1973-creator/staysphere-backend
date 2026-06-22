import {Router} from 'express';
import tokenvalidator from '../middlewares/tokenValidator.js';
import hostvalidator from '../middlewares/hostValidator.js';
import {getListingsController , 
        getListingByIdController , 
        getListingByHostController , 
        createListingController, 
        updateListingController , 
        deleteListingController} from '../controllers/ListingController.js'


const router = Router();

router.get('/', getListingsController)



// Protected routes for hosts

router.get('/host/my-listings', 
            tokenvalidator, 
            hostvalidator , 
            getListingByHostController)

router.post('/', 
            tokenvalidator , 
            hostvalidator , 
            createListingController)

router.put('/:id', 
            tokenvalidator,
            hostvalidator, 
            updateListingController)

router.delete('/:id', 
                tokenvalidator , 
                hostvalidator, 
                deleteListingController)




router.get('/:id', getListingByIdController)

export default router;