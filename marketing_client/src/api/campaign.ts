import axios, { type AxiosResponse } from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const API_BASE = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, 
});

export type CampaignForm = {
  title: string;
  message: string;
  overlayFile?: File 
  targetFile?: File
  button_url: string;
  isActive: boolean;
  comments: string;
};

export type Campaign = {
  id: number;
  title: string;
  message: string;
  target_url: string;
  overlay_url: string;
  button_url: string;
  isActive: boolean;
  comments: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignImage = {
  id: number;
  title: string;
  redactedImageUrl: string;
  unredactedImageUrl: string;
  createdAt: string;
};

export type Target = {
  target_url: string;
};

const createCampaignFormData = (input: CampaignForm): FormData => {
  const fd = new FormData();

  const appendIfPresent = (key: string, value?: string | boolean | File) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'boolean') {
      fd.append(key, String(value));
      return;
    }
    if (typeof value === 'string') {
      if (value === '') return;
      fd.append(key, value);
      return;
    }
    
    fd.append(key, value, value.name);
  };

  appendIfPresent('title', input.title);
  appendIfPresent('message', input.message);
  appendIfPresent('comments', input.comments);
  appendIfPresent('button_url', input.button_url);
  appendIfPresent('isActive', input.isActive);
  appendIfPresent('overlay', input.overlayFile);
  appendIfPresent('target', input.targetFile);
  return fd;
};

//API Methods
export async function getAllCampaigns(): Promise<Campaign[]> {
  const res: AxiosResponse<Campaign[]> = await api.get('/getCampaign/all');
  return res.data;
}

export async function getAllImages(): Promise<CampaignImage[]> {
  const res: AxiosResponse<any> = await api.get('/getImagesHandler');
  // server responds { success: true, images: [...] }
  return (res.data && res.data.images) as CampaignImage[];
}

export async function uploadImagePair(title: string, redacted?: File, unredacted?: File): Promise<{ id: number; title: string; message?: string }> {
  const fd = new FormData();
  if (title) fd.append('title', title);
  if (redacted) fd.append('redacted', redacted, redacted.name);
  if (unredacted) fd.append('unredacted', unredacted, unredacted.name);

  const res: AxiosResponse<any> = await api.post('/uploadImages', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const res: AxiosResponse<Campaign[]> = await api.get('/getCampaign/active');
  return res.data;
}

export async function getCampaignById(id: number): Promise<Campaign> {
  const res: AxiosResponse<Campaign> = await api.get(`/getCampaign/${id}`);
  return res.data;
}

export async function postCampaign(input: CampaignForm): Promise<Campaign> {
  const fd = createCampaignFormData(input);
  const res: AxiosResponse<Campaign> = await api.post('/postCampaign', fd);
  return res.data;
}

export async function updateCampaign(id: number, input: CampaignForm): Promise<Campaign> {
  const fd = createCampaignFormData(input);
  const res: AxiosResponse<Campaign> = await api.put(`/updateCampaign/${id}`, fd);
  return res.data;
}

export async function deleteCampaign(id: number): Promise<{ message: string }> {
  const res: AxiosResponse<{ message: string }> = await api.delete(`/deleteCampaign/${id}`);
  return res.data;
}

export async function getTarget(): Promise<Target> {
  const res: AxiosResponse<Target> = await api.get('/getTarget');
  return res.data;
}

export async function uploadCampaignSimple(title: string, message: string, buttonUrl: string, isActive?: boolean): Promise<any> {
  const body = { title, message, buttonUrl, isActive };
  const res: AxiosResponse<any> = await api.post('/campaign/upload', body, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}