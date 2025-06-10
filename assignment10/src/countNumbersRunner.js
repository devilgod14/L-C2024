const DivisorMatchCounter = require('./countNumbers');
const InputReader = require('./inputReader'); 

const divisorMatcher = new DivisorMatchCounter();
const inputReader = new InputReader(); 

/**
 * Validates and parses the initial input lines.
 * @param {string[]} lines - An array of raw input strings.
 * @returns {{numTestCases: number, testCaseXValues: string[]}} - Parsed number of test cases and the lines containing X values.
 * @throws {Error} If input is invalid or incomplete.
 */
function validateAndParseInitialInput(lines) {
  if (lines.length === 0) {
    throw new Error("No input provided. Please provide the number of test cases (T) followed by T lines of X values.");
  }

  const numTestCases = parseInt(lines[0], 10);

  if (isNaN(numTestCases) || numTestCases < 0) {
    throw new Error("Invalid number of test cases (T). T must be a non-negative integer.");
  }

  if (lines.length < numTestCases + 1) {
    throw new Error(`Not enough input lines. Expected ${numTestCases + 1} lines but received ${lines.length}.`);
  }

  return { numTestCases, testCaseXValues: lines.slice(1) };
}

/**
 * Processes each test case, calculates the result, and collects them.
 * @param {number} numTestCases - The total number of test cases.
 * @param {string[]} testCaseXValues - An array of strings, each representing an value for a test case.
 * @param {DivisorMatchCounter} counterInstance - The instance of DivisorMatchCounter to use for calculations.
 * @returns {number[]} An array of results for each valid test case.
 */
function processTestCases(numTestCases, testCaseXValues, counterInstance) {
  const results = [];
  for (let i = 0; i < numTestCases; i++) {
    const rawX = testCaseXValues[i];
    const userInput = parseInt(rawX, 10);

    if (isNaN(userInput)) {
      console.error(`Warning: Skipping invalid input X for test case ${i + 1}. Expected an integer, but received: '${rawX}'.`);
      continue;
    }
    results.push(counterInstance.countMatchingDivisors(userInput));
  }
  return results;
}

/**
 * @param {number[]} results - An array of results to print.
 */
function displayResults(results) {
  console.log("\n--- Results ---");
  if (results.length === 0) {
    console.log("No valid results to display.");
  } else {
    results.forEach(res => {
      console.log(res);
    });
  }
  console.log("--- End of Results ---\n");
}

// Initial prompt to the user when the script starts
console.log("Please provide your input in the following format:");
console.log("Number of test cases (T)");
console.log(" Value for test case 1");
console.log(" Value for test case 2");
console.log("  ...");
console.log(`Maximum X allowed is ${DivisorMatchCounter.MAX_PROBLEM_CONSTRAINT_X}.`);


// Main execution flow, now using the InputReader
inputReader.readAllLines()
  .then(inputLines => {
    try {
      const { numTestCases, testCaseXValues } = validateAndParseInitialInput(inputLines);
      const results = processTestCases(numTestCases, testCaseXValues, divisorMatcher);
      displayResults(results);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  })
  .catch(error => {
    console.error(`An unexpected error occurred during input reading: ${error.message}`);
  });