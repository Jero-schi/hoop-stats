import { describe, it } from 'node:test';
import { calculatePercentage } from '../src/utils/math';

describe('Math Utilities - calculatePercentage', () => {
    it('should correctly calculate a simple percentage', () => {
        // Si tiro 10 veces y meto 4, debería ser 40.0%
        expect(calculatePercentage(4, 10)).toBe('40.0');
    });

    it('should return "0.0" if attempted is 0 (preventing division by zero NaN errors)', () => {
        // En matemáticas reales 0/0 es "NaN", queremos evitar eso
        expect(calculatePercentage(0, 0)).toBe('0.0');
    });

    it('should round to 1 decimal correctly', () => {
        // 1 de 3 es 33.3333%, debería redondearse a 33.3
        expect(calculatePercentage(1, 3)).toBe('33.3');

        // 2 de 3 es 66.6666%, debería redondearse a 66.7
        expect(calculatePercentage(2, 3)).toBe('66.7');
    });

    it('should handle weird bad data gracefully', () => {
        // Qué pasa si anotó más de lo que intentó por error del usuario? 
        // No puede dar más de 100%
        expect(calculatePercentage(15, 10)).toBe('100.0');

        // Y si los datos son negativos? No puede dar debajo de 0%
        expect(calculatePercentage(-5, 10)).toBe('0.0');
    });
});
