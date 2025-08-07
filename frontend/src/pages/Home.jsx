import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import {
    PeopleOutlined,
    TourOutlined,
    BookOnlineOutlined,
    DashboardOutlined,
    AddCircleOutlined,
    VisibilityOutlined
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTours: 0,
        totalReservations: 0,
        totalCustomers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [toursRes, reservationsRes, customersRes] = await Promise.all([
                    axios.get('/tours'),
                    axios.get('/reservations'),
                    axios.get('/customers')
                ]);
                setStats({
                    totalTours: toursRes.data.length,
                    totalReservations: reservationsRes.data.length,
                    totalCustomers: customersRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    const adminModules = [
        {
            icon: <PeopleOutlined sx={{ fontSize: 40, color: '#F5D042' }} />,
            title: 'Gestión de Clientes',
            description: 'Administra la información de tus clientes, crea nuevos perfiles y mantén actualizada su información.',
            actions: [
                { label: 'Ver Clientes', link: '/customers', icon: <VisibilityOutlined /> },
                { label: 'Crear Cliente', link: '/create-customer', icon: <AddCircleOutlined /> }
            ]
        },
        {
            icon: <TourOutlined sx={{ fontSize: 40, color: '#F5D042' }} />,
            title: 'Gestión de Tours',
            description: 'Crea, modifica y elimina tours. Gestiona precios, fechas disponibles y descripciones.',
            actions: [
                { label: 'Ver Tours', link: '/tours', icon: <VisibilityOutlined /> },
                { label: 'Crear Tour', link: '/create-tour', icon: <AddCircleOutlined /> }
            ]
        },
        {
            icon: <BookOnlineOutlined sx={{ fontSize: 40, color: '#F5D042' }} />,
            title: 'Gestión de Reservas',
            description: 'Administra las reservas de tus clientes, crea nuevas reservas y gestiona cancelaciones.',
            actions: [
                { label: 'Ver Reservas', link: '/reservations', icon: <VisibilityOutlined /> },
                { label: 'Crear Reserva', link: '/create-reservation', icon: <AddCircleOutlined /> }
            ]
        }
    ];

    if (!user) {
        return (
            <Box>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #0A174E 0%, #1a2a6e 100%)',
                        color: 'white',
                        py: 12,
                        textAlign: 'center'
                    }}
                >
                    <Container maxWidth="md">
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            Panel Administrativo
                            <Box component="span" sx={{ color: '#F5D042', display: 'block' }}>
                                TourAgency
                            </Box>
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 4,
                                opacity: 0.9,
                                fontSize: { xs: '1.2rem', md: '1.5rem' }
                            }}
                        >
                            Sistema de gestión para agencias de viajes.
                            Administra clientes, tours y reservas desde un solo lugar.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/login"
                            sx={{
                                backgroundColor: '#F5D042',
                                color: '#0A174E',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#E6C03A'
                                }
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {/* Dashboard Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0A174E 0%, #1a2a6e 100%)',
                    color: 'white',
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}
                    >
                        <DashboardOutlined sx={{ fontSize: 40 }} />
                        Dashboard Administrativo
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Bienvenido, {user.email}
                    </Typography>
                </Container>
            </Box>

            {/* Statistics Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #F5D042 0%, #E6C03A 100%)',
                                color: '#0A174E'
                            }}
                        >
                            <TourOutlined sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {stats.totalTours}
                            </Typography>
                            <Typography variant="h6">
                                Tours Disponibles
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #0A174E 0%, #1a2a6e 100%)',
                                color: 'white'
                            }}
                        >
                            <BookOnlineOutlined sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {stats.totalReservations}
                            </Typography>
                            <Typography variant="h6">
                                Reservas Activas
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                                color: 'white'
                            }}
                        >
                            <PeopleOutlined sx={{ fontSize: 48, mb: 2 }} />
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {stats.totalCustomers}
                            </Typography>
                            <Typography variant="h6">
                                Clientes Registrados
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Admin Modules Section */}
                <Typography
                    variant="h4"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{
                        color: '#0A174E',
                        fontWeight: 'bold',
                        mb: 4
                    }}
                >
                    Módulos de Administración
                </Typography>
                <Grid container spacing={4}>
                    {adminModules.map((module, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    minHeight: '350px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <Box sx={{ mb: 2 }}>
                                        {module.icon}
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        gutterBottom
                                        sx={{
                                            color: '#0A174E',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {module.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.6,
                                            height: '48px',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {module.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                                    {module.actions.map((action, actionIndex) => (
                                        <Button
                                            key={actionIndex}
                                            variant={actionIndex === 0 ? "contained" : "outlined"}
                                            component={Link}
                                            to={action.link}
                                            startIcon={action.icon}
                                            fullWidth
                                            sx={{
                                                backgroundColor: actionIndex === 0 ? '#0A174E' : 'transparent',
                                                borderColor: '#0A174E',
                                                color: actionIndex === 0 ? 'white' : '#0A174E',
                                                '&:hover': {
                                                    backgroundColor: actionIndex === 0 ? '#0d1a5c' : 'rgba(10, 23, 78, 0.04)'
                                                }
                                            }}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;