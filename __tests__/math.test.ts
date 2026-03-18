import { calculatePercentage, calculateAverage } from '../src/utils/math';

describe('Math Utilities - calculatePercentage', () => {
    it('should correctly calculate a simple percentage', () => {
        expect(calculatePercentage(4, 10)).toBe('40.0');
    });

    it('should return "0.0" if attempted is 0 (preventing division by zero NaN errors)', () => {
        expect(calculatePercentage(0, 0)).toBe('0.0');
        expect(calculatePercentage(5, 0)).toBe('0.0');
    });

    it('should round to 1 decimal correctly', () => {
        expect(calculatePercentage(1, 3)).toBe('33.3');
        expect(calculatePercentage(2, 3)).toBe('66.7');
    });

    it('should handle negative values gracefully', () => {
        expect(calculatePercentage(-5, 10)).toBe('0.0');
    });

    it('should cap at 100% if made > attempted', () => {
        expect(calculatePercentage(15, 10)).toBe('100.0');
    });
});

describe('Math Utilities - calculateAverage', () => {
    it('should correctly calculate an average', () => {
        expect(calculateAverage(150, 10)).toBe('15.0');
    });

    it('should round average to 1 decimal', () => {
        expect(calculateAverage(10, 3)).toBe('3.3');
        expect(calculateAverage(20, 3)).toBe('6.7');
    });

    it('should return "0.0" if games played is 0 (preventing division by zero)', () => {
        expect(calculateAverage(0, 0)).toBe('0.0');
        expect(calculateAverage(100, 0)).toBe('0.0');
    });

    it('should handle negative totals gracefully', () => {
        expect(calculateAverage(-50, 10)).toBe('0.0');
    });
});
