const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const { getCoordinates } = require('./geocoder_api'); // Assuming geocoder_api.js is in the same directory

async function coordinateFinderCLI() {
    return new Promise((resolve) => {
        readline.question('UserInput: ', async (placeInput) => {
            if (!placeInput) {
                console.log('Please enter a place name.');
                readline.close();
                resolve();
                return;
            }

            const coordinates = await getCoordinates(placeInput);

            if (coordinates) {
                console.log('Output:');
                console.log(`Latitude: ${coordinates.latitude}`);
                console.log(`Longitude: ${coordinates.longitude}`);
            }

            readline.close();
            resolve();
        });
    });
}

module.exports = { coordinateFinderCLI };