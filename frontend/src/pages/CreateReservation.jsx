import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material';
import {
    BookOnlineOutlined as ReservationIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateReservation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customerId: '',
        tourId: '',
        reservationDate: '',
        numberOfPeople: 1,
        status: 'pending',
        notes: ''
    });

    useEffect(() => {
        fetchTours();
        fetchCustomers();
    }, []);

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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const reservationData = {
                customer: formData.customerId,
                tour: formData.tourId,
                date: formData.reservationDate,
                numberOfPeople: parseInt(formData.numberOfPeople),
                status: formData.status,
                specialRequests: formData.notes,
                contactPhone: '123456789', // Valor por defecto
                emergencyContact: {
                    name: 'Contacto de emergencia',
                    phone: '987654321'
                }
            };
            await axios.post('/reservations', reservationData);
            setSuccess('Reserva creada exitosamente');
            setTimeout(() => {
                navigate('/reservations');
            }, 2000);
        } catch (error) {
            setError('Error al crear la reserva');
            console.error('Error creating reservation:', error);
        } finally {
            setLoading(false);
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
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/reservations')}
                        sx={{
                            color: 'white',
                            mb: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                         Reservas
                    </Button>
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
                        <ReservationIcon sx={{ fontSize: 40 }} />
                        Crear Nueva Reserva
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Registra una nueva reserva en el sistema
                    </Typography>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="md" sx={{ py: 4 }}>
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

                <Paper elevation={3} sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
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
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="reservationDate"
                                    label="Fecha de reserva"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.reservationDate}
                                    onChange={handleInputChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="numberOfPeople"
                                    label="Número de personas"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.numberOfPeople}
                                    onChange={handleInputChange}
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
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
                                    name="notes"
                                    label="Notas adicionales"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Solicitudes especiales, comentarios, etc."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/reservations')}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: '#0A174E',
                                            '&:hover': {
                                                backgroundColor: '#0d1a5c'
                                            }
                                        }}
                                    >
                                        {loading ? 'Creando...' : 'Crear Reserva'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateReservation;