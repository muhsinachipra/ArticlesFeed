// frontend\src\components\PublicRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
