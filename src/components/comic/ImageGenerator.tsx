
import React, { useState } from 'react';
import { generateImages } from '@/services/replicateService';
import { GenerationRequest, GenerationResult } from '@/types';

interface ImageGeneratorProps {
  onImageSelect: (imageUrl: string, prompt: string) => void;
  loading?: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageSelect, loading: externalLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('comic book style');
  const [numImages, setNumImages] = useState(4);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const request: GenerationRequest = {
        prompt: `${prompt}, ${style}`,
        numImages,
      };
      
      const result = await generateImages(request);
      setGeneratedImages(result.images);
    } catch (err) {
      console.error('Error generating images:', err);
      setError('Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl, prompt);
    setGeneratedImages([]);
    setPrompt('');
  };

  const presetStyles = [
    'comic book style',
    'manga style',
    'watercolor painting',
    'noir comic style',
    'retro comic style',
    'digital art',
    'pencil sketch',
    'pixel art'
  ];

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Generate Comic Panel</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to see in this panel..."
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Style</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetStyles.map((presetStyle) => (
            <button
              key={presetStyle}
              type="button"
              onClick={() => setStyle(presetStyle)}
              className={`text-xs px-2 py-1 rounded-full ${
                style === presetStyle 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {presetStyle}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="Custom style..."
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Number of Images</label>
        <input
          type="number"
          min={1}
          max={8}
          value={numImages}
          onChange={(e) => setNumImages(parseInt(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGenerate}
        disabled={loading || externalLoading}
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || externalLoading ? 'Generating...' : 'Generate Images'}
      </button>
      
      {generatedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Select an image to use:</h4>
          <div className="grid grid-cols-2 gap-2">
            {generatedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative cursor-pointer border rounded overflow-hidden aspect-square"
                onClick={() => handleImageSelect(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
