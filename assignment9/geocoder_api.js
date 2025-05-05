const fetch = require('node-fetch');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getCoordinates(placeName) {
    /**
     * Fetches latitude and longitude for a given place name using the geocode.maps.co API.
     *
     * Args:
     * placeName (string): The name of the place to geocode.
     *
     * Returns:
     * object: An object containing latitude and longitude as floats, or null if an error occurs.
     */
    const encodedPlace = encodeURIComponent(placeName);
    const apiKey = '681834beda8f4675343599bqv1891b6'; // Replaced with the provided API key
    const url = `https://geocode.maps.co/search?q=${encodedPlace}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error: HTTP status ${response.status}`);
            return null;
        }
        const data = await response.json();

        // Assuming the API returns an array of results, and we want the first one
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
            const latitude = parseFloat(data[0].lat);
            const longitude = parseFloat(data[0].lon);
            return { latitude, longitude };
        } else {
            console.error(`Error: Could not find latitude and longitude for '${placeName}'. API response:`, data);
            return null;
        }
    } catch (error) {
        console.error("Error during API request:", error);
        return null;
    }
}

function main() {
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