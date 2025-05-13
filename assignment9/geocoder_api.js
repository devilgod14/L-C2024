const fetch = require('node-fetch');

// Adapter function to handle the API interaction
async function geocodeAPIAdapter(encodedPlace) {
    const url = `https://geocode.maps.co/search?q=${encodedPlace}&api_key=${process.env.API_KEY}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`API Error: HTTP status ${response.status}`);
            return { error: `HTTP status ${response.status}` };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Request Error:", error);
        return { error: error.message };
    }
}

async function getCoordinates(placeName) {
    /**
     * Fetches latitude and longitude for a given place name using an adapter
     * for the geocode.maps.co API.
     *
     * Args:
     * placeName (string): The name of the place to geocode.
     *
     * Returns:
     * object: An object containing latitude and longitude as floats, or null if an error occurs.
     */
    const encodedPlace = encodeURIComponent(placeName);
    const apiResponse = await geocodeAPIAdapter(encodedPlace);

    if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0].lat && apiResponse[0].lon) {
        const latitude = parseFloat(apiResponse[0].lat);
        const longitude = parseFloat(apiResponse[0].lon);
        return { latitude, longitude };
    } else {
        console.error(`Error: Could not find latitude and longitude for '${placeName}'. API response:`, apiResponse);
        return null;
    }
}