/**
 * @class DivisorMatchCounter
 * @description A utility class to efficiently count integers 'n' where 'n' and 'n+1'
 * have the same number of positive divisors.
 */
class DivisorMatchCounter {
  /**
   * @private
   * @readonly
   * @type {number}
   * @description The maximum value for which divisor counts are precomputed.
   */
  #maxPrecomputationLimit;

  /**
   * @private
   * @readonly
   * @type {number[]}
   * @description An array where #divisorCounts[k] stores the number of positive divisors of k.
   */
  #divisorCounts;

  /**
   * @const {number}
   * @description The maximum constraint for 'X' as specified in the problem,
   * used to determine the maximum precomputation limit.
   */
  static MAX_PROBLEM_CONSTRAINT_X = 100000;

  constructor(precomputationLimit = DivisorMatchCounter.MAX_PROBLEM_CONSTRAINT_X) {
    this.#maxPrecomputationLimit = precomputationLimit;
    // Array size is precomputationLimit + 2 to safely access index (precomputationLimit + 1)
    this.#divisorCounts = new Array(this.#maxPrecomputationLimit + 2).fill(0);
    this.#precomputeDivisorCounts();
  }

  #precomputeDivisorCounts() {
    // Iterate from 1 up to maxPrecomputationLimit + 1 to cover all potential 'n' and 'n+1' values.
    for (let i = 1; i <= this.#maxPrecomputationLimit + 1; i++) {
      // For each number 'i', increment the count for all its multiples 'j'.
      // This correctly calculates the number of divisors for each 'j'.
      for (let j = i; j <= this.#maxPrecomputationLimit + 1; j += i) {
        this.#divisorCounts[j]++;
      }
    }
  }

  /**
   * @public
   * @description Returns the pre-computed number of positive divisors for a given integer.
   * @param {number} num - The integer for which to get the divisor count.
   * @returns {number} The number of positive divisors of 'num'.
   * @throws {Error} If 'num' is out of the precomputed range or is not a positive integer.
   */
  getDivisorCountOf(num) {
    if (num < 1 || num > this.#maxPrecomputationLimit + 1) {
      throw new Error(`Number ${num} is outside the precomputed range [1, ${this.#maxPrecomputationLimit + 1}] or invalid.`);
    }
    return this.#divisorCounts[num];
  }

  /**
   * @public
   * @description Counts the number of integers 'n' within the range [1, X]
   * for which 'n' and 'n+1' have the same number of positive divisors.
   * @param {number} upperLimit - The upper limit for 'n' (inclusive). Must be a positive integer.
   * @returns {number} The count of such integers 'n'. Returns 0 if X < 1.
   */
  countMatchingDivisors(upperLimit) {
    // Handle invalid 
    if (upperLimit < 1) {
      return 0;
    }
    // Ensure X is within the precomputed range.
    if (upperLimit > this._maxPrecomputationLimit) {
      console.warn(`Warning: X (${upperLimit}) exceeds the precomputed limit (${this._maxPrecomputationLimit}). Results might be inaccurate or cause errors.`);
    }

    let matchingCount = 0;
    // Iterate 'n' from 1 up to 'X' (inclusive)
    for (let n = 1; n <= upperLimit; n++) {
      // Compare the number of divisors for 'n' and 'n+1'.
      // getDivisorCountOf handles range validation internally.
      if (this.getDivisorCountOf(n) === this.getDivisorCountOf(n + 1)) {
        matchingCount++;
      }
    }
    return matchingCount;
  }
}

module.exports = DivisorMatchCounter;