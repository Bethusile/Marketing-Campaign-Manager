const API_BASE_URL = (import.meta.env as Record<string, any>).VITE_API_BASE_URL || 'http://localhost:3000';

export const updateCampaignStatus = async (id: string, isActive: boolean): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/toggleCampaign/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
    
      return { success: false, error: true, status: response.status, message: response.statusText };
    }

    const data = await response.json();
    return { success: true, error: false, data };
    
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Failed to update campaign:', error);
    
    return { success: false, error: true, message: error.message };
  }
};