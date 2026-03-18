import { render, screen } from '@testing-library/react';
import { AuthError } from '../../src/app/login/auth-error';

describe('AuthError Component', () => {
    it('renders the error message correctly when message is provided', () => {
        const errorMessage = "Invalid credentials";
        render(<AuthError message={errorMessage} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        // The alert circle icon should be present, difficult to test text format for SVGs but the container should be there
    });

    it('renders nothing if no message is provided', () => {
        const { container } = render(<AuthError />);
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing if message is an empty string', () => {
        const { container } = render(<AuthError message="" />);
        expect(container.firstChild).toBeNull();
    });
});
