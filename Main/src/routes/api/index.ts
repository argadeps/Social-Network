import { Router } from 'express';
import { userRoutes } from './user-routes.js';
import { thoughtRoutes } from './thought-routes.js';


const router = Router();

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

export default router;
