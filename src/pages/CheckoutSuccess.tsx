
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderStatus } from '@/services/stripeService';

const CheckoutSuccess = () => {
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Get session ID from URL
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/dashboard');
      return;
    }
    
    const checkOrderStatus = async () => {
      try {
        const status = await getOrderStatus(sessionId);
        setOrderStatus(status);
      } catch (error) {
        console.error('Error checking order status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkOrderStatus();
  }, [user, navigate, location]);
  
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-4">Thank You!</h1>
          <p className="text-xl mb-8">Your order has been successfully placed.</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold mb-2">Order Status:</h2>
            <p className="capitalize">{orderStatus}</p>
          </div>
          
          <p className="text-gray-600 mb-6">
            We'll send you an email with tracking information once your comic is shipped.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Back to Dashboard
            </Link>
            
            <Link 
              to="/create" 
              className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10"
            >
              Create Another Comic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
