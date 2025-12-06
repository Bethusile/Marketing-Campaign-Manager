// Created by Bethusile Mafumana :
export interface Campaign {
  id: number;
  title: string;
  uploaded: string;
  expires: string;
  status: 'Active' | 'Inactive';
  imageSrc: string;
}

export const campaignsData: Campaign[] = [
  { id: 1, title: 'Holiday Season AR Experience', uploaded: 'Nov 15, 2024', expires: 'Dec 31, 2024', status: 'Active', imageSrc: 'https://placehold.co/600x450/334155/ffffff?text=Holiday+AR' },
  { id: 2, title: 'Tech Conference Demo', uploaded: 'Nov 1, 2024', expires: 'Nov 30, 2024', status: 'Active', imageSrc: 'https://placehold.co/600x450/475569/ffffff?text=Conference+Demo' },
  { id: 3, title: 'Product Launch - Q4 2024', uploaded: 'Oct 20, 2024', expires: 'Jan 15, 2025', status: 'Active', imageSrc: 'https://placehold.co/600x450/64748b/ffffff?text=Q4+Launch' },
  { id: 4, title: 'Brand Awareness Campaign', uploaded: 'Sep 1, 2024', expires: 'Oct 31, 2024', status: 'Inactive', imageSrc: 'https://placehold.co/600x450/94a3b8/ffffff?text=Brand+Awareness' },
  { id: 5, title: 'Employee Onboarding AR', uploaded: 'Aug 15, 2024', expires: 'No Expiry', status: 'Active', imageSrc: 'https://placehold.co/600x450/334155/ffffff?text=Onboarding+AR' },
  { id: 6, title: 'Summer Sale Promotion', uploaded: 'Jun 1, 2024', expires: 'Aug 31, 2024', status: 'Inactive', imageSrc: 'https://placehold.co/600x450/475569/ffffff?text=Summer+Sale' },
];
