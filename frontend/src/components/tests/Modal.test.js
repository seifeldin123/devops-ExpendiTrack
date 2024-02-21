import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BasicModal from '../Modal';

describe('BasicModal Unit Tests', () => {
    it('renders the modal when show is true', () => {
        const handleClose = jest.fn();
        render(
            <BasicModal show={true} handleClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </BasicModal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render the modal when show is false', () => {
        const handleClose = jest.fn();
        const { container } = render(
            <BasicModal show={false} handleClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </BasicModal>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('calls handleClose when the close button is clicked', () => {
        const handleClose = jest.fn();
        render(
            <BasicModal show={true} handleClose={handleClose} title="Test Modal">
                <p>Modal Content</p>
            </BasicModal>
        );

        fireEvent.click(screen.getByText('×'));
        expect(handleClose).toHaveBeenCalled();
    });

});
