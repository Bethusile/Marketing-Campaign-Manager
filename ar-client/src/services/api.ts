export interface Campaign {
  id: number;
  title: string;
  message: string;
  button_url : string;
  target_url: string;
  display_url: string;
  is_active: boolean;
  created_at: string;
}

const Camp1: Campaign = {
    id: 1,
    title: 'Campaign 1',
    message: 'This is campaign 1 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
    button_url: 'https://bbdsoftware.com/',
    display_url: '/masked_image.png',
    target_url: '/target1.webp',
    is_active: true,
    created_at: new Date().toISOString()
};

const Camp2: Campaign = {
    id: 2,
    title: 'Campaign 2',
    message: 'This is campaign 2 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
    button_url: 'https://bbdsoftware.com/',
    display_url: '/display2.webp',
    target_url: '/target2.webp',
    is_active: true,
    created_at: new Date().toISOString()
};

const Camp3: Campaign = {
    id: 3,
    title: 'Campaign 3',
    message: 'This is campaign 3 <br>Clear understanding of your <b style="color: red;">goals</b>, <br>with a clear focus on <b style="color: red;">communication</b>.',
    button_url: 'https://bbdsoftware.com/',
    display_url: '/display3.webp',
    target_url: '/target1.webp',
    is_active: false,
    created_at: new Date().toISOString()
};

const campaigns: Campaign[] = [Camp1, Camp2, Camp3];

export const getActiveCampaignTargets = async (): Promise<Record<number, string>> => {
  // Mock response for testing
  const result: Record<number, string> = {};
  for (let index = 0; index < campaigns.length; index++) {
    const campaign = campaigns[index];
    if (campaign.is_active) {
      result[campaign.id] = campaign.target_url;
    }
  }
  return Promise.resolve(result);
};

export const getCampaign = (id: number) => {
  // Mock response for testing
  return campaigns.find(c => c.id === id);
};


