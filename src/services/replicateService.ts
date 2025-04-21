
import { GenerationRequest, GenerationResult } from '@/types';

// Mock Replicate API service - to be replaced with actual implementation
export const generateImages = async (request: GenerationRequest): Promise<GenerationResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response with placeholder images
  const mockImages = [
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
  ];
  
  // Select random subset of images based on numImages
  const numImages = request.numImages || 1;
  const selectedImages = [...mockImages].sort(() => 0.5 - Math.random()).slice(0, numImages);
  
  return {
    images: selectedImages,
    id: 'mock-generation-' + Date.now()
  };
};

export const checkGenerationStatus = async (id: string): Promise<GenerationResult | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    images: [
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    id
  };
};

export const cancelGeneration = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock response
  return true;
};
