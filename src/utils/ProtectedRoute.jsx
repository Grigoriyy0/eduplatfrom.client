import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    // Check if the user is authenticated (e.g., check for a token in localStorage)
    const token = localStorage.getItem("accessToken");

    // Additional validation can be added here (e.g., token expiration check)
    if (!token) return false;

    // Optional: Verify token format or decode to check expiration
    try {
        // Simple check for JWT format (at least 2 dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
            localStorage.removeItem("accessToken");
            return false;
        }

        // Check expiration if token contains exp field
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("accessToken");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("accessToken");
        return false;
    }
};

// Function to clear authentication data
export const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    // Remove other auth-related items if needed
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        // Check authentication status when component mounts
        setIsAuth(isAuthenticated());
    }, []);

    // Show loading state while checking authentication
    if (isAuth === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p>Проверка авторизации...</p>
            </div>
        );
    }

    return isAuth ? <Component {...rest} /> : <Navigate to="/signin" replace />;
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;