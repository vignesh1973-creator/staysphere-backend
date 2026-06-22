import {Router} from 'express';
import tokenValidator from '../middlewares/tokenValidator.js';
import {getProfileController, updateProfileController, deleteProfileController} from '../controllers/ProfileController.js';
const router = Router();


router.use(tokenValidator);

router.get('/', getProfileController)
      .put('/', updateProfileController)
      .delete('/', deleteProfileController);

export default router;