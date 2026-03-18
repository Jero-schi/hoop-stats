import { render, screen } from '@testing-library/react';
import { TextInput } from '../../src/app/login/text-input';

describe('TextInput Component', () => {
    it('renders label and input correctly', () => {
        render(
            <TextInput
                id="test-input"
                name="test"
                label="Custom Label"
                placeholder="Enter some text"
            />
        );

        expect(screen.getByText('Custom Label')).toBeInTheDocument();

        const inputElement = screen.getByPlaceholderText('Enter some text');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute('type', 'text');
        expect(inputElement).toHaveAttribute('name', 'test');
        expect(inputElement).toHaveAttribute('id', 'test-input');
    });

    it('respects the provided type and required props', () => {
        render(
            <TextInput
                id="email-input"
                name="email"
                type="email"
                label="Email Address"
                required
            />
        );

        // Since there is no placeholder, we can query by Role 'textbox'
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveAttribute('type', 'email');
        expect(inputElement).toBeRequired();
    });
});
