import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} from '../controllers/CustomerController.js';

const router = Router();

// Todas las rutas de clientes requieren autenticación (solo admin)
router.use(authRequired);

router.get('/customers', getAllCustomers);
router.get('/customers/search', searchCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

export default router;