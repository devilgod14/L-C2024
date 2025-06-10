const DivisorMatchCounter = require('../src/countNumbers.js'); // This will initially fail

describe('DivisorMatchCounter', () => {
  let divisorMatcher;
  const TEST_MAX_LIMIT = 100; // Small limit for initial tests

  beforeAll(() => {
    // Initialize the counter for all tests in this describe block
    divisorMatcher = new DivisorMatchCounter(TEST_MAX_LIMIT);
  });

  // Test helper function for divisor count
  test('getDivisorCountOf should correctly count divisors for basic numbers', () => {
    expect(divisorMatcher.getDivisorCountOf(1)).toBe(1);
    expect(divisorMatcher.getDivisorCountOf(6)).toBe(4); // Divisors: 1, 2, 3, 6
    expect(divisorMatcher.getDivisorCountOf(7)).toBe(2); // Divisors: 1, 7 (prime)
    expect(divisorMatcher.getDivisorCountOf(12)).toBe(6); // Divisors: 1, 2, 3, 4, 6, 12
  });

   test('should correctly count divisors for larger known numbers', () => {
      expect(divisorMatcher.getDivisorCountOf(14)).toBe(4); // Divisors: 1, 2, 7, 14
      expect(divisorMatcher.getDivisorCountOf(15)).toBe(4); // Divisors: 1, 3, 5, 15
      expect(divisorMatcher.getDivisorCountOf(16)).toBe(5); // Divisors: 1, 2, 4, 8, 16
      expect(divisorMatcher.getDivisorCountOf(100)).toBe(9); // Divisors: 1, 2, 4, 5, 10, 20, 25, 50, 100
      expect(divisorMatcher.getDivisorCountOf(101)).toBe(2); // Divisors: 1, 101 (prime)
    });

    test('should throw error for numbers out of precomputed range or invalid input', () => {
      expect(() => divisorMatcher.getDivisorCountOf(0)).toThrow('Number 0 is outside the precomputed range');
      expect(() => divisorMatcher.getDivisorCountOf(-5)).toThrow('Number -5 is outside the precomputed range');
      expect(() => divisorMatcher.getDivisorCountOf(maxProblemConstraintX + 2)).toThrow(`Number ${maxProblemConstraintX + 2} is outside the precomputed range`);
    });
  });

  describe('countMatchingDivisors', () => {
    test('should return 2 for X = 15 (sample case from problem statement)', () => {
      expect(divisorMatcher.countMatchingDivisors(15)).toBe(2);
    });

    test('should return 0 for X = 1 (n=1: d(1)=1, d(2)=2 - no match)', () => {
      expect(divisorMatcher.countMatchingDivisors(1)).toBe(0);
    });

    test('should return 1 for X = 2 (n=2: d(2)=2, d(3)=2 - 1 match)', () => {
      expect(divisorMatcher.countMatchingDivisors(2)).toBe(1);
    });

    test('should return 1 for X = 7 (only n=2 has a match up to 7)', () => {
      expect(divisorMatcher.countMatchingDivisors(7)).toBe(1);
    });

    test('should return 0 for X = 0 (invalid input but handled gracefully)', () => {
      expect(divisorMatcher.countMatchingDivisors(0)).toBe(0);
    });

    test('should return 4 for X = 30 (n=2, 14, 21, 26 - 4 matches)', () => {
      // Known matches up to 30:
      // n=2: d(2)=2, d(3)=2  (Match)
      // n=14: d(14)=4, d(15)=4 (Match)
      // n=21: d(21)=4, d(22)=4 (Match)
      // n=26: d(26)=4, d(27)=4 (Match)
      expect(divisorMatcher.countMatchingDivisors(30)).toBe(4);
    });

    test('should handle maximum X efficiently and return a non-negative count', () => {
      // This test primarily checks for performance and that no uncaught errors occur
      // when processing the largest allowed input X.
      const result = divisorMatcher.countMatchingDivisors(maxProblemConstraintX);
      expect(result).toBeGreaterThanOrEqual(0);
    });

  test('should return 2 for X = 15 (sample case)', () => {
      // For n=2: d(2)=2, d(3)=2 (Match)
      // For n=14: d(14)=4, d(15)=4 (Match)
      expect(divisorMatcher.countMatchingDivisors(15)).toBe(2);
    });

});