//JaysonBam
//Function that call on apis for server information

import type { Campaign } from "../types/campaign";

const API_BASE_URL = String(import.meta.env.VITE_SERVER_URL);


function isObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object' && !Array.isArray(x);
}

function normalizeToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

function isRawCampaign(obj: unknown): obj is {
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
} {
  if (!isObject(obj)) return false;
  // minimal shape check: must have at least an id or target field
  return ('id' in obj) || ('targetUrl' in obj) || ('target_url' in obj);
}

export const getActiveCampaignTargets = async (): Promise<Array<{id: number; targetUrl: string;}>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/getCampaign/active`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid response shape');

    const result: Array<{id: number; targetUrl: string}> = [];
    for (const item of data) {
      if (!isObject(item)) continue;
      const isActive = (item.isActive ?? item.is_active) === true;
      if (!isActive) continue;
      const rawTarget = item.targetUrl ?? item.target_url;
      const rawTargetStr = normalizeToString(rawTarget) ?? '';
      if (!rawTargetStr) {
        // eslint-disable-next-line no-console
        console.warn(`campaign ${String(item.id ?? '<unknown>')} is active but has no targetUrl`);
        continue;
      }
      const target = /^https?:\/\//.test(rawTargetStr) ? rawTargetStr : `${API_BASE_URL}${rawTargetStr}`;
      const idNum = Number(item.id ?? item['id']);
      result.push({ id: idNum, targetUrl: target });
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Server error, could not fetch data");
  }
};

export const getCampaign = async (id: number): Promise<Campaign | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/getCampaign/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (!isObject(data)) throw new Error('Invalid campaign response');

    const targetRaw = data.targetUrl ?? data.target_url ?? '';
    const displayRaw = data.displayUrl ?? data.display_url ?? data.overlay_url ?? '';
    const buttonRaw = data.buttonUrl ?? data.button_url ?? '';

    const targetStr = normalizeToString(targetRaw);
    const displayStr = normalizeToString(displayRaw);
    const buttonStr = normalizeToString(buttonRaw) ?? '';

    const targetUrl = targetStr ? (/^https?:\/\//.test(targetStr) ? targetStr : `${API_BASE_URL}${targetStr}`) : undefined;
    const displayUrl = displayStr ? (/^https?:\/\//.test(displayStr) ? displayStr : `${API_BASE_URL}${displayStr}`) : undefined;
    if (!targetUrl) console.warn(`Campaign ${id} missing targetUrl`);
    if (!displayUrl) console.warn(`Campaign ${id} missing displayUrl`);

    const campaign: Campaign = {
      id: Number(data.id),
      title: normalizeToString(data.title) ?? '',
      message: normalizeToString(data.message) ?? '',
      buttonUrl: buttonStr,
      targetUrl: targetUrl ?? '',
      displayUrl: displayUrl ?? '',
      isActive: Boolean(data.isActive ?? data.is_active ?? false),
      createdAt: normalizeToString(data.createdAt) ?? normalizeToString(data.created_at) ?? '',
    };
    return campaign;
  } catch (error) {
    console.error(error);
    throw new Error("User error to fetch data");
  }
};
