import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { AccountCircle, ExploreOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        handleClose();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#0A174E' }}>
            <Toolbar>
                <ExploreOutlined sx={{ mr: 2, color: '#F5D042' }} />
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: '#F5D042',
                        fontWeight: 'bold'
                    }}
                >
                    TourAgency
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        sx={{ color: 'white', mr: 2 }}
                    >
                        Inicio
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                                sx={{ color: '#F5D042' }}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Typography>{user?.fullName || user?.username}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{ color: 'white', mr: 1 }}
                            >
                                Iniciar Sesión
                            </Button>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/register"
                                sx={{
                                    backgroundColor: '#F5D042',
                                    color: '#0A174E',
                                    '&:hover': {
                                        backgroundColor: '#E6C03A'
                                    }
                                }}
                            >
                                Registrarse
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;