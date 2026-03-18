import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '../../src/app/login/password-input';

describe('PasswordInput Component', () => {
    it('renders with label and hidden text by default', () => {
        render(<PasswordInput id="psw" name="password" label="Contraseña" />);

        expect(screen.getByText('Contraseña')).toBeInTheDocument();
        const inputElement = screen.getByPlaceholderText('••••••••');
        expect(inputElement).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility when the eye icon is clicked', () => {
        render(<PasswordInput id="psw" name="password" label="Contraseña" />);

        const inputElement = screen.getByPlaceholderText('••••••••');

        // El botón dentro del input tiene type="button" para no enviarse en un form
        const toggleButton = screen.getByRole('button');

        // Estado inicial
        expect(inputElement).toHaveAttribute('type', 'password');

        // Simular click para mostrar
        fireEvent.click(toggleButton);
        expect(inputElement).toHaveAttribute('type', 'text');

        // Simular click para esconder de nuevo
        fireEvent.click(toggleButton);
        expect(inputElement).toHaveAttribute('type', 'password');
    });

    it('passes extra attributes correctly', () => {
        render(
            <PasswordInput
                id="psw"
                name="password"
                label="Contraseña"
                required
                minLength={6}
            />
        );

        const inputElement = screen.getByPlaceholderText('••••••••');
        expect(inputElement).toBeRequired();
        expect(inputElement).toHaveAttribute('minLength', '6');
    });
});
