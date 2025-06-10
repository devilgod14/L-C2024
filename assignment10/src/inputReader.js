const readline = require('readline');

class InputReader {

  readAllLines() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout 
      });

      let inputLines = [];
      rl.on('line', (line) => {
        inputLines.push(line);
      });

      rl.on('close', () => {
        resolve(inputLines);
      });

      // Handle potential errors on the input stream
      rl.on('error', (err) => {
        reject(new Error(`Error reading input: ${err.message}`));
      });
    });
  }
}

module.exports = InputReader;