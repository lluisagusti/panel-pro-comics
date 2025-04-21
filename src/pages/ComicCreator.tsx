
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useComic } from '@/contexts/ComicContext';
import ImageGenerator from '@/components/comic/ImageGenerator';
import ComicPanel from '@/components/comic/ComicPanel';
import { ComicPanel as ComicPanelType } from '@/types';
import { createCheckoutSession } from '@/services/stripeService';

interface LayoutOption {
  id: string;
  name: string;
  columns: number;
  rows: number;
}

const ComicCreator = () => {
  const { user } = useAuth();
  const { 
    comics, 
    currentComic, 
    setCurrentComic, 
    createComic, 
    updateComic,
    addPanel,
    removePanel,
    updatePanel,
    addTextBubble,
    updateTextBubble,
    removeTextBubble,
    addCaption,
    updateCaption,
    removeCaption,
    publishComic
  } = useComic();
  
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Predefined layout options
  const layoutOptions: LayoutOption[] = [
    { id: 'layout-1', name: '2x2 Grid', columns: 2, rows: 2 },
    { id: 'layout-2', name: '3x2 Grid', columns: 3, rows: 2 },
    { id: 'layout-3', name: '2x3 Grid', columns: 2, rows: 3 },
    { id: 'layout-4', name: '1x3 Strip', columns: 1, rows: 3 },
    { id: 'layout-5', name: '3x1 Strip', columns: 3, rows: 1 },
  ];
  
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      const comic = comics.find(c => c.id === id);
      if (comic) {
        setCurrentComic(comic);
        setTitle(comic.title);
      } else {
        navigate('/dashboard');
      }
    } else {
      setTitle('Untitled Comic');
    }
  }, [id, comics, user, navigate]);
  
  const handleCreateComic = () => {
    if (!user) return;
    const newComic = createComic(title, user.id);
    navigate(`/create/${newComic.id}`);
  };
  
  const handleUpdateTitle = () => {
    if (!currentComic) return;
    
    const updatedComic = {
      ...currentComic,
      title
    };
    
    updateComic(updatedComic);
  };
  
  const handleAddPanel = (imageUrl: string, prompt: string) => {
    if (!currentComic) return;
    addPanel(currentComic.id, imageUrl, prompt);
  };
  
  const handleRegeneratePanel = (panel: ComicPanelType) => {
    // In a real app, this would use the panel's prompt to generate a new image
    // For now, we'll just replace it with a placeholder
    const placeholderImages = [
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
      'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
      'https://images.unsplash.com/photo-1469041797191-50ace28483c3',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027'
    ];
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    const updatedPanel = {
      ...panel,
      imageUrl: randomImage
    };
    
    updatePanel(currentComic.id, updatedPanel);
  };
  
  const handleCheckout = async () => {
    if (!currentComic || !user) return;
    
    setLoading(true);
    try {
      const response = await createCheckoutSession(
        currentComic.id,
        user.id,
        1999 // $19.99 in cents
      );
      
      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublish = () => {
    if (!currentComic) return;
    publishComic(currentComic.id);
    setShowCheckout(true);
  };
  
  if (!user) {
    return <div>Please log in to create comics</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            className="text-2xl font-bold border-b border-gray-300 focus:border-primary focus:outline-none bg-transparent"
          />
        </div>
        
        <div className="flex space-x-4">
          {currentComic ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handlePublish}
                disabled={currentComic.panels.length === 0}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {currentComic.isPublished ? 'Update & Checkout' : 'Publish & Checkout'}
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateComic}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Create New Comic
            </button>
          )}
        </div>
      </div>
      
      {currentComic && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Comic Layout</h2>
              <div className="flex space-x-4 overflow-x-auto py-2 mb-4">
                {layoutOptions.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setSelectedLayout(layout)}
                    className={`flex-shrink-0 p-2 border rounded-md ${
                      selectedLayout.id === layout.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300'
                    }`}
                  >
                    {layout.name}
                  </button>
                ))}
              </div>
              
              <div 
                className="grid gap-4" 
                style={{ 
                  gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`
                }}
              >
                {currentComic.panels.map((panel) => (
                  <ComicPanel
                    key={panel.id}
                    panel={panel}
                    onRegeneratePanel={() => handleRegeneratePanel(panel)}
                    onAddTextBubble={(style) => addTextBubble(currentComic.id, panel.id, 'New text bubble', style)}
                    onAddCaption={(position) => addCaption(currentComic.id, panel.id, 'New caption', position)}
                    onRemovePanel={() => removePanel(currentComic.id, panel.id)}
                    onEditTextBubble={(id, text) => {
                      const bubble = panel.textBubbles.find(b => b.id === id);
                      if (bubble) {
                        updateTextBubble(currentComic.id, panel.id, { ...bubble, text });
                      }
                    }}
                    onMoveTextBubble={(id, position) => {
                      const bubble = panel.textBubbles.find(b => b.id === id);
                      if (bubble) {
                        updateTextBubble(currentComic.id, panel.id, { ...bubble, position });
                      }
                    }}
                    onRemoveTextBubble={(id) => removeTextBubble(currentComic.id, panel.id, id)}
                    onEditCaption={(id, text) => {
                      const caption = panel.captions.find(c => c.id === id);
                      if (caption) {
                        updateCaption(currentComic.id, panel.id, { ...caption, text });
                      }
                    }}
                    onRemoveCaption={(id) => removeCaption(currentComic.id, panel.id, id)}
                  />
                ))}
                
                {/* Empty panel placeholders */}
                {Array.from({ length: selectedLayout.rows * selectedLayout.columns - currentComic.panels.length }).map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex items-center justify-center bg-gray-50"
                  >
                    <div className="text-gray-400 text-center p-4">
                      <p>Add a panel here</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {showCheckout && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Print Copy</h2>
                <p className="mb-4">Your comic has been published! Order a physical copy delivered to your door.</p>
                
                <div className="flex items-center justify-between p-4 border rounded-md mb-4">
                  <div>
                    <h3 className="font-semibold">{currentComic.title}</h3>
                    <p className="text-sm text-gray-600">{currentComic.panels.length} panels</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$19.99</p>
                    <p className="text-sm text-gray-600">Includes shipping</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            )}
          </div>
          
          <div>
            <ImageGenerator onImageSelect={handleAddPanel} loading={loading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicCreator;
