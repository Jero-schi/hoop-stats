import { render, screen } from '@testing-library/react';
import { AuthHeader } from '../../src/app/login/auth-header';

describe('AuthHeader Component', () => {
    it('displays the generic title', () => {
        render(<AuthHeader isSignup={false} />);

        // Verifica que la palabra HOOPS (o parcialmente) esté en el documento.
        // Debido al modo en el que react-testing-library trata fragmentos de texto con spans intermedios, un regex ayuda.
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/HOOPS\s*STATS/i);
    });

    it('displays the correct subtitle for login (isSignup=false)', () => {
        render(<AuthHeader isSignup={false} />);
        expect(screen.getByText('Panel de Control para Entrenadores')).toBeInTheDocument();
    });

    it('displays the correct subtitle for signup (isSignup=true)', () => {
        render(<AuthHeader isSignup={true} />);
        expect(screen.getByText('Bienvenido, crea tu cuenta entrenador')).toBeInTheDocument();
    });
});
