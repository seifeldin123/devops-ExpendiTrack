import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './MainLayout';
import { UserProvider } from '../contexts/UserContext';

describe('MainLayout', () => {
    it('renders its children', () => {
        render(
            <Router>
                <UserProvider>
                    <MainLayout>
                        <div>Test Child</div> {/* Test rendering of child component */}
                    </MainLayout>
                </UserProvider>
            </Router>
        );
        // Ensure that the child component "Test Child" is rendered
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
});
