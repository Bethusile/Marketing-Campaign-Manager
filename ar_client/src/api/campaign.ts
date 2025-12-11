const API_BASE_URL = String(import.meta.env.VITE_SERVER_URL);

import type { ARStartupResponse, UnredactedImageResponse } from '../types/api';

// fetch AR startup payload (message, buttonUrl, targetMindUrl, targetIdMap)
export const getARStartup = async (
  id: string
): Promise<{ message?: string | null; buttonUrl?: string | null; targetMindUrl?: string | null; targetIdMap: Record<number, number> } | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ar/${id}`);
    if (!response.ok) {
      // If campaign not found, treat as "no startup" so callers fall back to camera-only
      if (response.status === 404) {
        // console.warn(`getARStartup: campaign ${id} not found (404)`);
        return undefined;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    const data = (await response.json()) as ARStartupResponse;

    const message = data.message;
    const buttonUrl = data.buttonUrl;
    const targetMindUrl = data.targetMindUrl;

    const targetIdMap: Record<number, number> = {};

    if (data.targetIdMap && typeof data.targetIdMap === 'object') {
      for (const [k , v] of Object.entries(data.targetIdMap)) {
        const keyNum = k;
        const valNum = v;
        targetIdMap[Number(keyNum)] = valNum;
      }
    }

    return { message, buttonUrl, targetMindUrl, targetIdMap };
  } catch (err) {
    // console.error('getARStartup error', err);
    // For any other failure (network/server), surface a server error so UI can show a message
    throw new Error('Server error, could not fetch data');
  }
};

// GET /ar/image/unredacted/:id -> { unredactedImageUrl }
export const getUnredactedImageById = async (id: number): Promise<string | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ar/image/unredacted/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as UnredactedImageResponse;
    const url = data.unredactedImageUrl;
    if (!url) return undefined;
    return url;
  } catch (err) {
    // console.error('getUnredactedImageById error', err);
    throw new Error('Failed to fetch unredacted image');
  }
};