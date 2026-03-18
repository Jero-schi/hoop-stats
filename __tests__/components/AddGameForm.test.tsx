import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddGameForm from '../../src/components/AddGameForm';

// Mock de Supabase Client y useRouter de NextJS
jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ id: 'p1', first_name: 'John', last_name: 'Doe' }], error: null }),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn()
    })
}));

describe('AddGameForm Component', () => {
    it('renders the trigger button initially', () => {
        render(<AddGameForm teamId="123" />);
        // En estado inicial, el formulario modal no se ve, solo el botón "Nuevo Partido"
        expect(screen.getByText('Nuevo Partido')).toBeInTheDocument();
        expect(screen.queryByText('Configuración del Partido')).not.toBeInTheDocument();
    });

    it('opens the modal when trigger is clicked', async () => {
        render(<AddGameForm teamId="123" />);

        const button = screen.getByText('Nuevo Partido');
        fireEvent.click(button);

        // Deberia abrir el modal
        await waitFor(() => {
            expect(screen.getByText('Configuración del Partido')).toBeInTheDocument();
        });
    });

    it('displays validation errors for empty opponent submission', async () => {
        render(<AddGameForm teamId="123" />);

        // Open Modal
        fireEvent.click(screen.getByText('Nuevo Partido'));

        await waitFor(() => {
            expect(screen.getByText('Empezar Partido')).toBeInTheDocument();
        });

        // Click Submit without filling fields
        const submitButton = screen.getByText('Empezar Partido');
        fireEvent.click(submitButton);

        // Zod validation should kick in displaying the minLength error
        await waitFor(() => {
            expect(screen.getByText('El nombre del rival debe tener al menos 2 letras')).toBeInTheDocument();
        });
    });
});
