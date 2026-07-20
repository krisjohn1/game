import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, LogOut, Settings, UserCircle, LogIn } from 'lucide-react';

export default function Navbar({ user, onLoginClick, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-6">
      <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        LUCKY STAR
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-1.5 border border-gray-700">
              <Coins className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="font-mono text-yellow-400 font-bold">{user.balance?.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <UserCircle className="w-5 h-5 mr-1" />
              <span>{user.username}</span>
            </div>

            {user.role === 'admin' && (
              <Link to="/admin" className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button 
            onClick={onLoginClick}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}
