// Campaign related types

export interface Campaign {
  id: number;
  title: string;
  message: string;
  buttonUrl: string;
  targetUrl: string;
  displayUrl: string;
  isActive: boolean;
  createdAt: string;
}
