import { Router } from 'express';
import registerUser from '../controllers/registerController';
import loginUser from '../controllers/loginController';
import getAllUsers from '../controllers/getUsersController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);

export default router;