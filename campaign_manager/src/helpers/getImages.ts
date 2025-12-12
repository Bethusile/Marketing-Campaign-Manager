
// The function fetches images from the server via the API call
export async function getImages() {

    const API_URL = import.meta.env.VITE_SERVER_URL + '/api/getImagesHandler';


    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            return {
                success: false,
                message: `Server returned ${response.status}`,
            };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch images',
            error: String(error)
        };
    }
}
