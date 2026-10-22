import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAccessToken } from '../api/api';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const data = await authService.getMe();
                if (data.user) {
                    setUser(data.user);
                    setAccessToken(data.access_token);
                }
            } catch (err) {
                setUser(null);
                setAccessToken(null);
                console.warn("Sessão expirada ou usuário deslogado.");
                return null
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setAccessToken(data.access_token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Falha no Login',
                code: error.code
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);