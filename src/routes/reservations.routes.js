import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    createReservation,
    getAllReservations,
    getMyReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    updateReservationStatus
} from '../controllers/ReservationController.js';

const router = Router();

// Todas las rutas de reservaciones requieren autenticación
router.use(authRequired);

// Rutas para clientes
router.post('/reservations', createReservation);
router.get('/reservations/my', getMyReservations);
router.get('/reservations/:id', getReservationById);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', deleteReservation);

// Rutas para admin
router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/status', updateReservationStatus);

export default router;