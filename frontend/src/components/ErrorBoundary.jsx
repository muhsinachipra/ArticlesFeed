// src/components/ErrorBoundary.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-message">
                        <h1 className="error-title">Oops! Something went wrong.</h1>
                        <p className="error-description">
                            We encountered an unexpected error. Please try refreshing the page or come back later.
                        </p>
                        <button
                            className="error-button"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
};

export default ErrorBoundary;
