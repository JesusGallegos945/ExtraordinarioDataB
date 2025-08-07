import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete
} from '@mui/material';
import {
    AccessTime,
    AttachMoney,
    LocationOn,
    Group,
    CalendarToday,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    BookmarkBorder,
    Person,
    Tour
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Reservations = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [tours, setTours] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        tourId: '',
        reservationDate: '',
        numberOfPeople: 1,
        status: 'pending',
        notes: ''
    });

    useEffect(() => {
        fetchReservations();
        fetchTours();
        fetchCustomers();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/reservations');
            setReservations(response.data);
        } catch (error) {
            setError('Error al cargar las reservas');
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTours = async () => {
        try {
            const response = await axios.get('/tours');
            setTours(response.data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleOpenDialog = (reservation = null) => {
        if (reservation) {
            setEditingReservation(reservation);
            setFormData({
                customerId: reservation.customer?._id || '',
                tourId: reservation.tour?._id || '',
                reservationDate: reservation.reservationDate ? reservation.reservationDate.split('T')[0] : '',
                numberOfPeople: reservation.numberOfPeople || 1,
                status: reservation.status || 'pending',
                notes: reservation.notes || ''
            });
        } else {
            setEditingReservation(null);
            setFormData({
                customerId: '',
                tourId: '',
                reservationDate: '',
                numberOfPeople: 1,
                status: 'pending',
                notes: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingReservation(null);
        setFormData({
            customerId: '',
            tourId: '',
            reservationDate: '',
            numberOfPeople: 1,
            status: 'pending',
            notes: ''
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
            const reservationData = {
                ...formData,
                numberOfPeople: parseInt(formData.numberOfPeople)
            };

            if (editingReservation) {
                await axios.put(`/reservations/${editingReservation._id}`, reservationData);
                setSuccess('Reserva actualizada exitosamente');
            } else {
                await axios.post('/reservations', reservationData);
                setSuccess('Reserva creada exitosamente');
            }
            handleCloseDialog();
            fetchReservations();
        } catch (error) {
            if (error.response?.status === 401) {
                setError('No tienes autorización para realizar esta acción. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                setError('No tienes permisos para gestionar reservas.');
            } else if (error.response?.data?.message) {
                setError(`Error: ${error.response.data.message}`);
            } else {
                setError('Error al guardar la reserva. Verifica tu conexión e intenta nuevamente.');
            }
            console.error('Error saving reservation:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (reservationId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
            try {
                await axios.delete(`/reservations/${reservationId}`);
                setSuccess('Reserva eliminada exitosamente');
                fetchReservations();
            } catch (error) {
                setError('Error al eliminar la reserva');
                console.error('Error deleting reservation:', error);
            }
        }
    };

    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            await axios.put(`/reservations/${reservationId}`, { status: newStatus });
            setSuccess('Estado de reserva actualizado');
            fetchReservations();
        } catch (error) {
            setError('Error al actualizar el estado');
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmada';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelada';
            case 'completed': return 'Completada';
            default: return status;
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesSearch = searchTerm === '' || 
            reservation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.tour.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || reservation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                        <BookmarkBorder sx={{ fontSize: 40 }} />
                        Gestión de Reservas
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Administra las reservas de tours de tu agencia
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

                {/* Search and Filters */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Buscar por cliente o tour"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Estado"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="pending">Pendiente</MenuItem>
                                    <MenuItem value="confirmed">Confirmada</MenuItem>
                                    <MenuItem value="completed">Completada</MenuItem>
                                    <MenuItem value="cancelled">Cancelada</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                        </Grid>
                    </Grid>
                </Box>

                {/* Reservations Table */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell><strong>Cliente</strong></TableCell>
                                    <TableCell><strong>Tour</strong></TableCell>
                                    <TableCell><strong>Fecha</strong></TableCell>
                                    <TableCell><strong>Personas</strong></TableCell>
                                    <TableCell><strong>Total</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    <TableCell><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReservations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                No se encontraron reservas
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReservations.map((reservation) => (
                                        <TableRow key={reservation._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Person sx={{ fontSize: 16, color: '#666' }} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {reservation.customer.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {reservation.customer.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Tour sx={{ fontSize: 16, color: '#666' }} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {reservation.tour.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {reservation.tour.destination}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 16, color: '#666' }} />
                                                    <Typography variant="body2">
                                                        {new Date(reservation.reservationDate).toLocaleDateString('es-ES')}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Group sx={{ fontSize: 16, color: '#666' }} />
                                                    <Typography variant="body2">
                                                        {reservation.numberOfPeople}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AttachMoney sx={{ fontSize: 16, color: '#666' }} />
                                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                                        ${reservation.tour.price * reservation.numberOfPeople}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={reservation.status}
                                                        onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                                                        variant="outlined"
                                                    >
                                                        <MenuItem value="pending">Pendiente</MenuItem>
                                                        <MenuItem value="confirmed">Confirmada</MenuItem>
                                                        <MenuItem value="completed">Completada</MenuItem>
                                                        <MenuItem value="cancelled">Cancelada</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleOpenDialog(reservation)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(reservation._id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

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

                {/* Dialog for Create/Edit Reservation */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        options={customers}
                                        getOptionLabel={(option) => `${option.name} - ${option.email}`}
                                        value={customers.find(c => c._id === formData.customerId) || null}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                customerId: newValue ? newValue._id : ''
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cliente"
                                                variant="outlined"
                                                fullWidth
                                                margin="dense"
                                                required
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        options={tours}
                                        getOptionLabel={(option) => `${option.name} - ${option.destination}`}
                                        value={tours.find(t => t._id === formData.tourId) || null}
                                        onChange={(event, newValue) => {
                                            setFormData({
                                                ...formData,
                                                tourId: newValue ? newValue._id : ''
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tour"
                                                variant="outlined"
                                                fullWidth
                                                margin="dense"
                                                required
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="dense"
                                        name="reservationDate"
                                        label="Fecha de reserva"
                                        type="date"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.reservationDate}
                                        onChange={handleInputChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="dense"
                                        name="numberOfPeople"
                                        label="Número de personas"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.numberOfPeople}
                                        onChange={handleInputChange}
                                        inputProps={{ min: 1 }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            name="status"
                                            value={formData.status}
                                            label="Estado"
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="pending">Pendiente</MenuItem>
                                            <MenuItem value="confirmed">Confirmada</MenuItem>
                                            <MenuItem value="completed">Completada</MenuItem>
                                            <MenuItem value="cancelled">Cancelada</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        name="notes"
                                        label="Notas adicionales"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Notas o comentarios sobre la reserva..."
                                    />
                                </Grid>
                            </Grid>
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
                                {editingReservation ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Reservations;