// test/countNumbers.test.js
const countNumbersWithSameDivisorCount = require('../src/countNumbers');

describe('countNumbersWithSameDivisorCount', () => {

  // Test Case 1: Smallest valid M (M=1)
  // Explanation: For N=1, only x=1 is in range. d(1)=1, d(1^2)=1. Count is 1.
  test('should return 1 for upperLimitN = 1', () => {
    expect(countNumbersWithSameDivisorCount(1)).toBe(1);
  });

});