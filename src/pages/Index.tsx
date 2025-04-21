import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-secondary to-secondary/30">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-primary">
              Create Amazing Comics with AI
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Turn your ideas into stunning comics with our AI-powered creation tool. 
              Generate images, add text bubbles, and share your creativity with the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="px-8 py-3 bg-primary text-white rounded-md text-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup"
                    className="px-8 py-3 bg-primary text-white rounded-md text-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login"
                    className="px-8 py-3 border-2 border-primary text-primary rounded-md text-lg font-semibold hover:bg-primary/10 transition-colors"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden transform rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Comic example 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden transform -rotate-3 translate-y-8">
                <img 
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" 
                  alt="Comic example 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden transform -rotate-6 -translate-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901" 
                  alt="Comic example 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden transform rotate-6 translate-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                  alt="Comic example 4" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-secondary/20 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary rounded-full text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Generate Images with AI</h3>
              <p className="text-gray-600">Describe what you want to see, and our AI will create beautiful comic panels for you.</p>
            </div>
            
            <div className="text-center p-6 bg-secondary/20 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary rounded-full text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Customize Your Comic</h3>
              <p className="text-gray-600">Add text bubbles, captions, and arrange panels to create your perfect story.</p>
            </div>
            
            <div className="text-center p-6 bg-secondary/20 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary rounded-full text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Publish & Print</h3>
              <p className="text-gray-600">Share your comic online or order physical prints delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Comic?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are bringing their stories to life with Panel Pro Comics.
          </p>
          <Link 
            to={user ? "/create" : "/signup"}
            className="px-8 py-3 bg-white text-primary rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {user ? "Create a Comic" : "Sign Up Now"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
