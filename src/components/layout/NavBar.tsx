
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const NavBar: React.FC = () => {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Panel Pro Comics</Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-white/80">
                Dashboard
              </Link>
              <Link to="/create" className="hover:text-white/80">
                Create Comic
              </Link>
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name || user.email}`} 
                    alt={user.name || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white text-foreground rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-secondary">
                    Profile
                  </Link>
                  <Link to="/my-comics" className="block px-4 py-2 hover:bg-secondary">
                    My Comics
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {!loading && (
                <>
                  <Link to="/login" className="py-2 px-4 rounded-md hover:bg-primary-foreground/10">
                    Log In
                  </Link>
                  <Link to="/signup" className="py-2 px-4 bg-white text-primary rounded-md hover:bg-white/90">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
