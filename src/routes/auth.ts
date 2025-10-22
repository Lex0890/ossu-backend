import { Router } from 'express';
import auth from '../controllers/auth';

const router = Router();

router.get('/', auth.login);

router.get('/callback', auth.callback);

router.post('/logout', auth.logout);

export default router;
