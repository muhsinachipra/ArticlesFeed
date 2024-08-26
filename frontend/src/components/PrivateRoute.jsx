// frontend\src\components\PrivateRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
