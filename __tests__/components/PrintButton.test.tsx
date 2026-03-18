import { render, screen, fireEvent } from '@testing-library/react';
import PrintButton from '../../src/components/PrintButton';

describe('PrintButton Component', () => {
    beforeEach(() => {
        // Mock window.print
        Object.defineProperty(window, 'print', {
            writable: true,
            value: jest.fn()
        });
    });

    it('renders correctly', () => {
        render(<PrintButton />);
        expect(screen.getByText('Exportar a PDF')).toBeInTheDocument();
    });

    it('calls window.print() when clicked', () => {
        render(<PrintButton />);

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(window.print).toHaveBeenCalledTimes(1);
    });
});
