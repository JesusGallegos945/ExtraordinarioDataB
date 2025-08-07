import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
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
    IconButton
} from '@mui/material';
import {
    AccessTime,
    AttachMoney,
    LocationOn,
    Group,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    TourOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Tours = () => {
    const { user } = useAuth();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        availableDates: '',
        image: '',
        capacity: '',
        destination: '',
        inclusions: ''
    });

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const response = await axios.get('/tours');
            setTours(response.data);
        } catch (error) {
            setError('Error al cargar los tours');
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (tour = null) => {
        if (tour) {
            setEditingTour(tour);
            setFormData({
                name: tour.name || '',
                description: tour.description || '',
                duration: (tour.duration || '').toString(),
                price: (tour.price || '').toString(),
                availableDates: tour.availableDates ? tour.availableDates.join(', ') : '',
                image: tour.image || '',
                capacity: (tour.maxCapacity || tour.capacity || '').toString(),
                destination: tour.destination || '',
                inclusions: tour.includes ? tour.includes.join(', ') : (tour.inclusions ? tour.inclusions.join(', ') : '')
            });
        } else {
            setEditingTour(null);
            setFormData({
                name: '',
                description: '',
                duration: '',
                price: '',
                availableDates: '',
                image: '',
                capacity: '',
                destination: '',
                inclusions: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTour(null);
        setFormData({
            name: '',
            description: '',
            duration: '',
            price: '',
            availableDates: '',
            image: '',
            capacity: '',
            destination: '',
            inclusions: ''
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
            const tourData = {
                ...formData,
                duration: parseInt(formData.duration),
                price: parseFloat(formData.price),
                maxCapacity: parseInt(formData.capacity),
                availableDates: formData.availableDates.split(',').map(date => date.trim()),
                includes: formData.inclusions.split(',').map(item => item.trim())
            };

            if (editingTour) {
                await axios.put(`/tours/${editingTour._id}`, tourData);
                setSuccess('Tour actualizado exitosamente');
            } else {
                await axios.post('/tours', tourData);
                setSuccess('Tour creado exitosamente');
            }
            handleCloseDialog();
            fetchTours();
        } catch (error) {
            if (error.response?.status === 401) {
                setError('No tienes autorización para realizar esta acción. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                setError('No tienes permisos para editar tours.');
            } else if (error.response?.data?.message) {
                setError(`Error: ${error.response.data.message}`);
            } else {
                setError('Error al guardar el tour. Verifica tu conexión e intenta nuevamente.');
            }
            console.error('Error saving tour:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (tourId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tour?')) {
            try {
                await axios.delete(`/tours/${tourId}`);
                setSuccess('Tour eliminado exitosamente');
                fetchTours();
            } catch (error) {
                setError('Error al eliminar el tour');
                console.error('Error deleting tour:', error);
            }
        }
    };

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (priceRange.min) params.append('minPrice', priceRange.min);
            if (priceRange.max) params.append('maxPrice', priceRange.max);

            const response = await axios.get(`/tours/search?${params}`);
            setTours(response.data);
        } catch (error) {
            setError('Error al buscar tours');
            console.error('Error searching tours:', error);
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
                        <TourOutlined sx={{ fontSize: 40 }} />
                        Gestión de Tours
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Administra los tours disponibles en tu agencia
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
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Buscar tours"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <TextField
                                fullWidth
                                label="Precio mín."
                                type="number"
                                variant="outlined"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField
                                fullWidth
                                label="Precio máx."
                                type="number"
                                variant="outlined"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSearch}
                                sx={{
                                    backgroundColor: '#0A174E',
                                    '&:hover': { backgroundColor: '#0d1a5c' },
                                    height: '56px'
                                }}
                            >
                                Buscar
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={1}>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tours Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {tours.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
                                    No se encontraron tours
                                </Typography>
                            </Grid>
                        ) : (
                            tours.map((tour) => (
                                <Grid item xs={12} sm={6} md={4} key={tour._id}>
                                    <Card
                                        sx={{
                                            height: '550px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: '200px',
                                                backgroundColor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {tour.image ? (
                                                <img
                                                    src={tour.image}
                                                    alt={tour.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Sin imagen
                                                </Typography>
                                            )}
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {tour.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ 
                                                    mb: 2, 
                                                    height: '60px', 
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {tour.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOn sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {tour.destination}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <AccessTime sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {tour.duration} días
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Group sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Hasta {tour.maxCapacity} personas
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <AttachMoney sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                                <Typography variant="h6" color="primary">
                                                    ${tour.price}
                                                </Typography>
                                            </Box>

                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(tour)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(tour._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
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

                {/* Dialog for Create/Edit Tour */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editingTour ? 'Editar Tour' : 'Nuevo Tour'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
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
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="dense"
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
                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        name="description"
                                        label="Descripción"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        margin="dense"
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
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        margin="dense"
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
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        margin="dense"
                                        name="capacity"
                                        label="Capacidad"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="dense"
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
                                        margin="dense"
                                        name="availableDates"
                                        label="Fechas disponibles (separadas por comas)"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.availableDates}
                                        onChange={handleInputChange}
                                        placeholder="2024-06-01, 2024-06-15, 2024-07-01"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        name="inclusions"
                                        label="Incluye (separado por comas)"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                        value={formData.inclusions}
                                        onChange={handleInputChange}
                                        placeholder="Transporte, Alojamiento, Comidas, Guía"
                                        required
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
                                {editingTour ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Tours;