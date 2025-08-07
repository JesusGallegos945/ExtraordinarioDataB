import React, { useState } from 'react';
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
    MenuItem
} from '@mui/material';
import {
    TourOutlined as TourIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTour = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        availableDates: '',
        image: '',
        capacity: '',
        destination: '',
        inclusions: '',
        difficulty: 'moderate'
    });

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
            const tourData = {
                ...formData,
                duration: parseInt(formData.duration),
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                availableDates: formData.availableDates.split(',').map(date => date.trim())
            };
            await axios.post('/tours', tourData);
            setSuccess('Tour creado exitosamente');
            setTimeout(() => {
                navigate('/tours');
            }, 2000);
        } catch (error) {
            setError('Error al crear el tour');
            console.error('Error creating tour:', error);
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
                        <TourIcon sx={{ fontSize: 40 }} />
                        Crear Nuevo Tour
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Agrega un nuevo tour al catálogo
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
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    name="name"
                                    label="Nombre del tour"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Descripción"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="destination"
                                    label="Destino"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="duration"
                                    label="Duración (días)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="price"
                                    label="Precio"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="capacity"
                                    label="Capacidad (personas)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Dificultad</InputLabel>
                                    <Select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        label="Dificultad"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="easy">Fácil</MenuItem>
                                        <MenuItem value="moderate">Moderado</MenuItem>
                                        <MenuItem value="hard">Difícil</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="image"
                                    label="URL de imagen"
                                    type="url"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="availableDates"
                                    label="Fechas disponibles (separadas por comas)"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.availableDates}
                                    onChange={handleInputChange}
                                    placeholder="2024-06-01, 2024-06-15, 2024-07-01"
                                    helperText="Ingresa las fechas en formato YYYY-MM-DD separadas por comas"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="inclusions"
                                    label="Inclusiones"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={formData.inclusions}
                                    onChange={handleInputChange}
                                    placeholder="Transporte, alojamiento, comidas, guía turístico..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/tours')}
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
                                        {loading ? 'Creando...' : 'Crear Tour'}
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

export default CreateTour;