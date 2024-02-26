// ErrorBoundary.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        // Log the error to an error reporting service like Sentry, LogRocket, etc.
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI for production
            return (
                <div className="error-boundary-fallback">
                    <h2>Oops! Something went wrong.</h2>
                    <p>We're sorry for the inconvenience. Please try one of the following:</p>
                    <ul>
                        <li><Link to="/">Go to the Home Page</Link></li>
                        <li><a href="/">Refresh the Page</a></li>
                    </ul>
                    {/* Optionally, include the error message and stack in development environment */}
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </details>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
