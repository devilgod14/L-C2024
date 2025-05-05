const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const { getCoordinates } = require('./geocoder_api');

async function main() {
    /**
     * A simple console application to get latitude and longitude for a place name.
     */
    readline.question('UserInput: ', async (placeInput) => {
        if (!placeInput) {
            console.log('Please enter a place name.');
            readline.close();
            return;
        }

        const coordinates = await getCoordinates(placeInput);

        if (coordinates) {
            console.log('Output:');
            console.log(`Latitude: ${coordinates.latitude}`);
            console.log(`Longitude: ${coordinates.longitude}`);
        }

        readline.close();
    });
}

main();