
// Adjust this base URL to match your backend server (e.g., localhost:3000)
const API_BASE_URL = 'http://localhost:3000'; 

export const updateCampaignStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/toggleCampaign/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update campaign:', error);
    // Return a standardized error object to display in your renderer
    return { error: 'API Call Failed', details: error };
  }
};