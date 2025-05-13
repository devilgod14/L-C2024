const fetch = require('node-fetch');
const { getCoordinates } = require('./geocoder_api.js');

jest.mock('node-fetch');

describe('Simple tests for getCoordinates', () => {
    beforeEach(() => {
        fetch.mockClear();
        delete process.env.API_KEY;
    });

    test('should work fine with a real place name', async () => {
        const mockApiResponse = {
            ok: true,
            json: async () => [{ lat: '51.5074', lon: '0.1278' }],
        };
        fetch.mockResolvedValue(mockApiResponse);

        const result = await getCoordinates('London');
        expect(result).toEqual({ latitude: 51.5074, longitude: 0.1278 });
    });

    test('should handle a non-existent place by returning null', async () => {
        const noResultsResponse = {
            ok: true,
            json: async () => [],
        };
        fetch.mockResolvedValue(noResultsResponse);

        const result = await getCoordinates('DefinitelyNowhere');
        expect(result).toBeNull();
    });

    test('should return null if the API has a problem', async () => {
        const errorResponse = {
            ok: false,
            status: 404,
        };
        fetch.mockResolvedValue(errorResponse);
        console.error = jest.fn();

        const result = await getCoordinates('Whateverville');
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error: HTTP status 404');
    });
});