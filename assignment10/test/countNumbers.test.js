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

  test('should return 2 for X = 15 (sample case)', () => {
      // For n=2: d(2)=2, d(3)=2 (Match)
      // For n=14: d(14)=4, d(15)=4 (Match)
      expect(divisorMatcher.countMatchingDivisors(15)).toBe(2);
    });
    
});