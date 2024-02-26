import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary'; // Update the import path as necessary

// Mock component that throws an error
class ErrorThrowingComponent extends React.Component {
    render() {
        throw new Error('Test error');
    }
}

describe('ErrorBoundary Tests', () => {

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });


    // Unit test to verify that ErrorBoundary catches errors and displays fallback UI
    it('displays an error message when a child component throws an error', () => {
        render(
            <MemoryRouter>
                <ErrorBoundary>
                    <ErrorThrowingComponent />
                </ErrorBoundary>
            </MemoryRouter>
        );

        expect(screen.getByText(/Oops! Something went wrong./)).toBeInTheDocument();
        expect(screen.getByText(/Go to the Home Page/)).toBeInTheDocument();
        expect(screen.getByText(/Refresh the Page/)).toBeInTheDocument();
    });

    // Integration test to simulate a real-world scenario within the app's routing context
    it('catches errors in child components within app routing and displays fallback UI', () => {
        render(
            <MemoryRouter initialEntries={['/error-route']}>
                <Routes>
                    <Route path="/error-route" element={
                        <ErrorBoundary>
                            <ErrorThrowingComponent />
                        </ErrorBoundary>
                    } />
                </Routes>
            </MemoryRouter>
        );

        // Verify that ErrorBoundary's fallback UI is rendered
        expect(screen.getByText(/Oops! Something went wrong./)).toBeInTheDocument();
        expect(screen.getByText(/We're sorry for the inconvenience./)).toBeInTheDocument();
        expect(screen.getByText(/Go to the Home Page/)).toBeInTheDocument();
    });
});
