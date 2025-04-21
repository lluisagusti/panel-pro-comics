
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useComic } from '@/contexts/ComicContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { comics } = useComic();
  const navigate = useNavigate();
  
  // Filter comics for the current user
  const userComics = user ? comics.filter(comic => comic.userId === user.id) : [];
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My Comics</h1>
        <Link 
          to="/create" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Create New Comic
        </Link>
      </div>
      
      {userComics.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">You haven't created any comics yet!</h2>
          <p className="mb-6 text-gray-600">Get started by creating your first comic masterpiece.</p>
          <Link 
            to="/create" 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 inline-block"
          >
            Create Your First Comic
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userComics.map(comic => (
            <div key={comic.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {comic.panels.length > 0 ? (
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={comic.panels[0].imageUrl} 
                    alt={comic.title} 
                    className="w-full h-full object-cover"
                  />
                  {comic.isPublished && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                      Published
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No panels yet</p>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{comic.title}</h3>
                <p className="text-gray-600 mb-4">
                  {comic.panels.length} panel{comic.panels.length !== 1 ? 's' : ''} • 
                  Created: {new Date(comic.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/create/${comic.id}`} 
                    className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {comic.panels.length > 0 ? 'Edit' : 'Continue'}
                  </Link>
                  
                  {comic.isPublished && (
                    <Link 
                      to={`/checkout/${comic.id}`} 
                      className="flex-1 text-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10"
                    >
                      Order Print
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
