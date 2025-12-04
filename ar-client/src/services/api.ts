//JaysonBam
//Function that call on apis for server information

import axios from "axios";
import type {Campaign} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getActiveCampaignTargets = async (): Promise<Record<number, string>> => {
  try {
    const response = await axios.get<Campaign[]>(`${API_BASE_URL}/api/campaigns/active`);
    const campaigns = response.data;
    const result: Record<number, string> = {};
    campaigns.forEach((campaign) => {
      if (campaign.isActive) {
        result[campaign.id] = `${API_BASE_URL}${campaign.targetUrl}`;
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getCampaign = async (id: number,): Promise<Campaign | undefined> => {
  try {
    const response = await axios.get<Campaign>(`${API_BASE_URL}/api/campaigns/${id}`);
    const campaign = response.data;
    return {
      ...campaign,
      targetUrl: `${API_BASE_URL}${campaign.targetUrl}`,
      displayUrl: `${API_BASE_URL}${campaign.displayUrl}`,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};