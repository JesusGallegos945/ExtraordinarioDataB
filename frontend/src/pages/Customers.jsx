import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Fab,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Customers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            setError('Error al cargar los clientes');
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || '',
                address: customer.address || ''
            });
        } else {
            setEditingCustomer(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCustomer(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: ''
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await axios.put(`/customers/${editingCustomer._id}`, formData);
                setSuccess('Cliente actualizado exitosamente');
            } else {
                await axios.post('/customers', formData);
                setSuccess('Cliente creado exitosamente');
            }
            handleCloseDialog();
            fetchCustomers();
        } catch (error) {
            if (error.response?.status === 401) {
                setError('No tienes autorización para realizar esta acción. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                setError('No tienes permisos para gestionar clientes.');
            } else if (error.response?.data?.message) {
                setError(`Error: ${error.response.data.message}`);
            } else {
                setError('Error al guardar el cliente. Verifica tu conexión e intenta nuevamente.');
            }
            console.error('Error saving customer:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (customerId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            try {
                await axios.delete(`/customers/${customerId}`);
                setSuccess('Cliente eliminado exitosamente');
                fetchCustomers();
            } catch (error) {
                setError('Error al eliminar el cliente');
                console.error('Error deleting customer:', error);
            }
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Debes iniciar sesión para acceder a esta página</Typography>
            </Container>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0A174E 0%, #1a2a6e 100%)',
                    color: 'white',
                    py: 6
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 40 }} />
                        Gestión de Clientes
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Administra la información de tus clientes
                    </Typography>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Teléfono</strong></TableCell>
                                <TableCell><strong>Dirección</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Cargando clientes...
                                    </TableCell>
                                </TableRow>
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No hay clientes registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer._id} hover>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone || 'No especificado'}</TableCell>
                                        <TableCell>{customer.address || 'No especificada'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Activo"
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(customer)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(customer._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: '#0A174E',
                        '&:hover': {
                            backgroundColor: '#0d1a5c'
                        }
                    }}
                    onClick={() => handleOpenDialog()}
                >
                    <AddIcon />
                </Fab>

                {/* Dialog for Create/Edit Customer */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label="Nombre completo"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="phone"
                                label="Teléfono"
                                type="tel"
                                fullWidth
                                variant="outlined"
                                value={formData.phone}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="address"
                                label="Dirección"
                                type="text"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancelar</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#0A174E',
                                    '&:hover': {
                                        backgroundColor: '#0d1a5c'
                                    }
                                }}
                            >
                                {editingCustomer ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Customers;