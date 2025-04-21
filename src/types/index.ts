
// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

// Comic Types
export interface ComicPanel {
  id: string;
  imageUrl: string;
  textBubbles: TextBubble[];
  captions: Caption[];
  generationPrompt?: string;
}

export interface TextBubble {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: 'speech' | 'thought';
}

export interface Caption {
  id: string;
  text: string;
  position: 'top' | 'bottom';
}

export interface Comic {
  id: string;
  userId: string;
  title: string;
  panels: ComicPanel[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

// AI Generation Types
export interface GenerationRequest {
  prompt: string;
  style?: string;
  numImages?: number;
}

export interface GenerationResult {
  images: string[];
  id: string;
}

// Order Types
export interface ShippingDetails {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  comicId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'canceled';
  shippingDetails: ShippingDetails;
  createdAt: string;
}
