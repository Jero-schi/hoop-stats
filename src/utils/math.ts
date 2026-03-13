/**
 * Calculates a percentage safely, avoiding division by zero and returning a formatted string.
 * @param made Amount of successful attempts (e.g. shots made)
 * @param attempted Total amount of attempts
 * @returns A string representing the percentage, e.g. "45.5", or "0.0" if no attempts.
 */
export function calculatePercentage(made: number, attempted: number): string {
    if (attempted <= 0) {
        return "0.0";
    }

    // Prevent negative numbers if bad data is somehow passed
    if (made < 0) made = 0;

    // Protect against weird cases where a player has more makes than attempts
    if (made > attempted) made = attempted;

    const percentage = (made / attempted) * 100;
    return percentage.toFixed(1);
}

/**
 * Calculates a per-game average safely.
 * @param total The total accumulated stat (e.g. 150 points)
 * @param games The number of games played (e.g. 10 games)
 * @returns A string representing the average rounded to 1 decimal, e.g. "15.0"
 */
export function calculateAverage(total: number, games: number): string {
    if (games <= 0) return "0.0";
    if (total < 0) total = 0; // Protect against weird database numbers
    return (total / games).toFixed(1);
}
