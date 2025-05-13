const { coordinateFinderCLI } = require('./cli_adapter'); // Import the adapter

async function main() {
    /**
     * A simple console application to get latitude and longitude for a place name,
     * now using an adapter to handle the boundary between user input/output
     * and the core logic.
     */
    await coordinateFinderCLI();
}

main();