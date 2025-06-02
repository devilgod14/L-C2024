const countNumbersWithSameDivisorCount = require('../src/countNumbers');

describe('countNumbersWithSameDivisorCount', () => {

  // Test Case 1: Smallest valid M (M=1)
  // Explanation: For N=1, only x=1 is in range. d(1)=1, d(1^2)=1. Count is 1.
  test('should return 1 for upperLimitN = 1', () => {
    expect(countNumbersWithSameDivisorCount(1)).toBe(1);
  });


  // Test Case: N = 0 (Negative Scenario - violates lower bound constraint)
  test('should return 0 for upperLimitN = 0 (violates constraints)', () => {
    // Explanation: Constraints state 1 <= N. If N is 0, no x >= 1 can be in range.
    expect(countNumbersWithSameDivisorCount(0)).toBe(0);
  });
 
   // Test Case: N = 10 (Positive Scenario - Sample Input)
  test('should return 1 for upperLimitN = 10 (based on mathematical proof)', () => {
    expect(countNumbersWithSameDivisorCount(10)).toBe(1);
  });

  // Test Case: Large N (Positive Scenario - adhering to constraints)
  test('should return 1 for a large upperLimitN like 10^9', () => {
    // Explanation: Regardless of how large N is (as long as N >= 1), only x=1 qualifies.
    expect(countNumbersWithSameDivisorCount(10**9)).toBe(1);
  });

  // Test Case: Very Large N (Positive Scenario - 10^18 using BigInt)
  // Use BigInt for numbers larger than Number.MAX_SAFE_INTEGER (2^53 - 1)
  test('should return 1 for a very large upperLimitN like 10^18 (using BigInt)', () => {
    const largeM = 10n**18n; // Use BigInt for large numbers in JS
    expect(countNumbersWithSameDivisorCount(largeM)).toBe(1);
  });


  // Test Case: N = -5 (Negative Scenario - violates lower bound constraint)
  test('should return 0 for negative upperLimitN like -5 (violates constraints)', () => {
    // Explanation: Constraints state 1 <= N. If N is negative, no x >= 1 can be in range.
    expect(countNumbersWithSameDivisorCount(-5)).toBe(0);
  });

  // Test Case: Non-integer input (edge case, though constraints specify integer)
  test('should return 0 for non-integer upperLimitN like 0.5', () => {
    // Explanation: While constraints specify integer N, robust code might handle non-integers.
    expect(countNumbersWithSameDivisorCount(0.5)).toBe(0);
  });


});