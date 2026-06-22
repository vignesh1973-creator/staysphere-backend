import {Router} from 'express';
import tokenValidator from '../middlewares/tokenValidator.js';
import HostController from '../controllers/HostController.js';

const router = Router();

router.use(tokenValidator);
router.patch('/become-host', HostController);




export default router;


