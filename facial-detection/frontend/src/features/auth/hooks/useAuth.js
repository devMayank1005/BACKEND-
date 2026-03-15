import { login, register, logout, getMe } from '../services/auth.api';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    async function handleRegister(userData) {
        try {
            const registeredUser = await register(userData);
            setUser(registeredUser.user);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    async function handleLogin(credentials) {
        try {
            const loggedInUser = await login(credentials);
            setUser(loggedInUser.user);
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    async function handlegetMe() {
        try {
            const currentUser = await getMe();
            setUser(currentUser.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false); // ✅ mark loading as done
        }
    }

    async function handleLogout() {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    useEffect(() => {
        handlegetMe();
    }, []);

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handlegetMe,
    };
};