import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
    IconButton
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#0A174E',
                color: 'white',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="#F5D042" gutterBottom>
                            TourAgency
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Descubre el mundo con nosotros. Ofrecemos las mejores experiencias
                            de viaje con tours únicos y memorables.
                        </Typography>
                        <Box>
                            <IconButton
                                color="inherit"
                                aria-label="Facebook"
                                sx={{ color: '#F5D042' }}
                            >
                                <Facebook />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="Twitter"
                                sx={{ color: '#F5D042' }}
                            >
                                <Twitter />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="Instagram"
                                sx={{ color: '#F5D042' }}
                            >
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="#F5D042" gutterBottom>
                            Servicios
                        </Typography>
                        <Typography variant="body2" display="block" sx={{ mb: 1 }}>
                            Tours Personalizados
                        </Typography>
                        <Typography variant="body2" display="block" sx={{ mb: 1 }}>
                            Guías Especializados
                        </Typography>
                        <Typography variant="body2" display="block" sx={{ mb: 1 }}>
                            Transporte Incluido
                        </Typography>
                        <Typography variant="body2" display="block">
                            Soporte 24/7
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" color="#F5D042" gutterBottom>
                            Contacto
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, color: '#F5D042' }} />
                            <Typography variant="body2">
                                Universidad Tecnológica de la Riviera Maya
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1, color: '#F5D042' }} />
                            <Typography variant="body2">
                                +52 993 111 1557
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ mr: 1, color: '#F5D042' }} />
                            <Typography variant="body2">
                                2302041@utrivieramaya.edu.mx
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        borderTop: '1px solid #F5D042',
                        mt: 4,
                        pt: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" color="inherit">
                        © {new Date().getFullYear()} TourAgency. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;