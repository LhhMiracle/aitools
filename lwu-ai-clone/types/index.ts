export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

export interface Creation {
  id: string;
  userId: string;
  type: 'image-generation' | 'background-removal' | 'face-enhancement' | 'style-transfer' | 'upscaling' | 'object-removal';
  originalUrl?: string;
  resultUrl: string;
  prompt?: string;
  creditsUsed: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  creditsRequired: number;
  category: string;
  featured: boolean;
}

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}
