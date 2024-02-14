import React from 'react';
import {getAllByTestId, render, screen} from '@testing-library/react';
import MainLayout from '../MainLayout';
import {UserProvider} from "../../contexts/UserContext";

describe('MainLayout Component', () => {
    it('renders the main content', () => {
        render(
            <UserProvider>
                <MainLayout>
                    <div>Main Content</div>
                </MainLayout>
            </UserProvider>
    );

        // Assert that the main content is rendered
        expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
});
