import React from 'react';
import { render, screen } from '@testing-library/react';
import PageNotFound from '../PageNotFound';

describe('PageNotFound', () => {
    it('displays the correct not found message and link to home page', () => {
        render(<PageNotFound />);
        expect(screen.getByText("We couldn't find that Web page (Error 404)")).toBeInTheDocument();
        expect(screen.getByText("We're sorry you ended up here. Sometimes a page gets moved or deleted, but hopefully we can help you find what you're looking for.")).toBeInTheDocument();
    });
});
