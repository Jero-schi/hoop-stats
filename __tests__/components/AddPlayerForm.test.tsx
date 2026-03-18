import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPlayerForm from '../../src/components/AddPlayerForm';

// Mock de Supabase Client y useRouter de NextJS
jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue({ error: null })
    }))
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: jest.fn()
    })
}));

describe('AddPlayerForm Component', () => {
    it('renders the trigger button initially', () => {
        render(<AddPlayerForm teamId="t-123" />);
        expect(screen.getByText('Añadir Jugador')).toBeInTheDocument();
        expect(screen.queryByText('Nuevo Perfil de Jugador')).not.toBeInTheDocument();
    });

    it('opens modal and displays correct validation errors for empty submits', async () => {
        render(<AddPlayerForm teamId="t-123" />);

        // Abrir el modal
        fireEvent.click(screen.getByText('Añadir Jugador'));

        await waitFor(() => {
            expect(screen.getByText('Nuevo Perfil de Jugador')).toBeInTheDocument();
        });

        // Intentar guardar sin datos
        const saveButton = screen.getByRole('button', { name: /Guardar Jugador/i });
        fireEvent.click(saveButton);

        // Zod debería activar errores en first_name y last_name
        await waitFor(() => {
            const errors = screen.getAllByText('Debe tener al menos 2 letras');
            expect(errors.length).toBeGreaterThanOrEqual(2); // Uno para nombre, otro para apellido
        });
    });

    it('displays error if bad numbers are provided', async () => {
        render(<AddPlayerForm teamId="t-123" />);

        // Abrir el modal
        fireEvent.click(screen.getByText('Añadir Jugador'));

        await waitFor(() => {
            expect(screen.getByText('Guardar Jugador')).toBeInTheDocument();
        });

        // Escribir datos inválidos
        const ageInput = screen.getByPlaceholderText('28');
        const heightInput = screen.getByPlaceholderText('198');

        fireEvent.change(ageInput, { target: { value: '5' } }); // Error, min 10
        fireEvent.change(heightInput, { target: { value: '30' } }); // Error, min 100

        // Simular Submit
        fireEvent.click(screen.getByRole('button', { name: /Guardar Jugador/i }));

        await waitFor(() => {
            expect(screen.getByText('Carga una edad válida (10-99)')).toBeInTheDocument();
            expect(screen.getByText('Altura inválida (100-250cm)')).toBeInTheDocument();
        });
    });
});
