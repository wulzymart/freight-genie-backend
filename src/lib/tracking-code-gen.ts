import { randomBytes } from 'crypto';

/**
 * Generates a 10-character alphanumeric tracking code
 * with origin and destination state codes at the beginning and end
 *
 * @param originStateCode Two-digit state code (e.g., 'CA')
 * @param destinationStateCode Two-digit state code (e.g., 'NY')
 * @returns A 10-character tracking code
 */
export function generateTrackingCode(
    originStateCode: string,
    destinationStateCode: string
): string {
    // Validate input state codes
    if (
        !originStateCode ||
        !destinationStateCode ||
        originStateCode.length !== 2 ||
        destinationStateCode.length !== 2
    ) {
        throw new Error('State codes must be exactly 2 characters long');
    }

    // Generate 6 random alphanumeric characters
    const randomPart = randomBytes(6)
        .toString('hex')
        .toUpperCase()
        .slice(0, 6);

    // Combine parts: origin state code + random chars + destination state code
    return `${originStateCode}${randomPart}${destinationStateCode}`;
}
