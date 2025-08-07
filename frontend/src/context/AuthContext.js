import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Configurar axios para incluir cookies
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:3000/api';

    // Configuración básica de axios sin interceptor global

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/auth/profile');
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post('/auth/login', userData);
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('/auth/register', userData);
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};