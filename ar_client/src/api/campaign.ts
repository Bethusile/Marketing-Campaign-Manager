//JaysonBam
//Function that call on apis for server information

import type { Campaign } from "../types/campaign";

// TODO: fix db type
type RawCampaign = {
  id?: number | string;
  title?: string;
  message?: string;
  buttonUrl?: string;
  button_url?: string;
  targetUrl?: string;
  target_url?: string;
  displayUrl?: string;
  display_url?: string;
  overlay_url?: string;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
};

const API_BASE_URL = (import.meta.env.VITE_SERVER_URL as string);

export const getActiveCampaignTargets = async (): Promise<Array<{id: number; targetUrl: string;}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/getCampaign/active`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const campaigns = (await response.json()) as RawCampaign[];
    const result: Array<{id: number; targetUrl: string}> = [];
    campaigns.forEach((campaign) => {
      const isActive = campaign.isActive ?? campaign.is_active ?? false;
      if (!isActive) return;
      const rawTarget = campaign.targetUrl ?? campaign.target_url ?? '';
      if (!rawTarget) {
        console.warn(`campaign ${campaign.id} is active but has no targetUrl`);
        return;
      }
      const target = /^https?:\/\//.test(rawTarget) ? rawTarget : `${API_BASE_URL}${rawTarget}`;
      result.push({ id: Number(campaign.id), targetUrl: target });
    });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Server error, could not fetch data");
  }
};

export const getCampaign = async (id: number,): Promise<Campaign | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/getCampaign/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rawCampaign = (await response.json()) as RawCampaign;
    const targetRaw = rawCampaign.targetUrl ?? rawCampaign.target_url ?? '';
    const displayRaw = rawCampaign.displayUrl ?? rawCampaign.display_url ?? rawCampaign.overlay_url ?? '';
    const buttonRaw = rawCampaign.buttonUrl ?? rawCampaign.button_url ?? '';
    const targetUrl = targetRaw ? (/^https?:\/\//.test(targetRaw) ? targetRaw : `${API_BASE_URL}${targetRaw}`) : undefined;
    const displayUrl = displayRaw ? (/^https?:\/\//.test(displayRaw) ? displayRaw : `${API_BASE_URL}${displayRaw}`) : undefined;
    if (!targetUrl) console.warn(`Campaign ${id} missing targetUrl`);
    if (!displayUrl) console.warn(`Campaign ${id} missing displayUrl`);
    const campaign: Campaign = {
      id: Number(rawCampaign.id),
      title: rawCampaign.title ?? '',
      message: rawCampaign.message ?? '',
      buttonUrl: buttonRaw,
      targetUrl: targetUrl ?? '',
      displayUrl: displayUrl ?? '',
      isActive: Boolean(rawCampaign.isActive ?? rawCampaign.is_active ?? false),
      createdAt: rawCampaign.createdAt ?? rawCampaign.created_at ?? '',
    };
    return campaign;
  } catch (error) {
    console.error(error);
    throw new Error("User error to fetch data");
  }
};
