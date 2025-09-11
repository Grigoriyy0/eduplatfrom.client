import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    // Check if the user is authenticated (e.g., check for a token in localStorage)
    const user = localStorage.getItem("accessToken");
    return user !== null; // Adjust this logic based on your authentication method
};

const ProtectedRoute = ({ component: Component }) => {
    return isAuthenticated() ? <Component /> : <Navigate to="/signin" />;
};

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired, // component should be a React component
};

export default ProtectedRoute;