export interface Campaign {
  id: number;
  title: string;
  message: string;
  redacted_image_url: string;
  unredacted_image_url: string;
  is_active: boolean;
  created_at: string;
}

export const getActiveCampaign = async (): Promise<Campaign> => {
  // Mock response for testing
  return Promise.resolve({
    id: 1,
    title: 'test',
    message: 'This is a demo',
    redacted_image_url: '/display.webp',
    unredacted_image_url: '/display.webp',
    is_active: true,
    created_at: new Date().toISOString()
  });
};
