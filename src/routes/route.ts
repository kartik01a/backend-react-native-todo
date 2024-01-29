import {Router} from 'express'

import {registerUser,getAllCategory,loginUser} from '../controllers/controller';

const router = Router()

router.post('/registerUser',registerUser);
router.post('/loginUser',loginUser);
router.post('/getAllCategory',getAllCategory);

export default router;
