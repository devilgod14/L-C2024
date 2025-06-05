const DivisorMatchCounter = require('./countNumbers.js'); // Import the core class

const divisorMatcher = new DivisorMatchCounter();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const numTestCases = parseInt(inputLines[0], 10);
  const results = [];
  for (let i = 1; i <= numTestCases; i++) {
    const userInput = parseInt(inputLines[i], 10);
    results.push(divisorMatcher.countMatchingDivisors(userInput));
  }

  results.forEach(res => {
    console.log(res);
  });
});