// test/countNumbers.test.js
const countNumbersWithSameDivisorCount = require('../src/countNumbers');

describe('countNumbersWithSameDivisorCount', () => {

  // Test Case 1: Smallest valid M (M=1)
  // Explanation: For N=1, only x=1 is in range. d(1)=1, d(1^2)=1. Count is 1.
  test('should return 1 for upperLimitN = 1', () => {
    expect(countNumbersWithSameDivisorCount(1)).toBe(1);
  });

  // test/countNumbers.test.js (add inside the describe block)
// ... existing tests ...

  // Test Case: N = 0 (Negative Scenario - violates lower bound constraint)
  test('should return 0 for upperLimitN = 0 (violates constraints)', () => {
    // Explanation: Constraints state 1 <= N. If N is 0, no x >= 1 can be in range.
    expect(countNumbersWithSameDivisorCount(0)).toBe(0);
  });


});