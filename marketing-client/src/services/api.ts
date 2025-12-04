import axios from 'axios';

export interface Campaign {
  id: number;
  title: string;
  message: string;
  redactedImageUrl: string;
  unredactedImageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export const getCampaigns = async () => {
  // Implement API call
  return Promise.resolve([]);
};

export const createCampaign = async (formData: FormData) => {
  // Implement API call
  return Promise.resolve();
};
