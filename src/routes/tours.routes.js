import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    createTour,
    getAllTours,
    getTourById,
    updateTour,
    deleteTour,
    searchTours
} from '../controllers/TourController.js';

const router = Router();

// Rutas públicas
router.get('/tours', getAllTours);
router.get('/tours/search', searchTours);
router.get('/tours/:id', getTourById);

// Rutas protegidas (solo admin)
router.post('/tours', authRequired, createTour);
router.put('/tours/:id', authRequired, updateTour);
router.delete('/tours/:id', authRequired, deleteTour);

export default router;