import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

router.use('/', weatherRoutes);

export default router;
