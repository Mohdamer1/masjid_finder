import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

// Kaaba Icon Component
const KaabaIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" stroke="currentColor" strokeWidth="1" fill="none"/>
    <rect x="8" y="8" width="8" height="6" fill="currentColor" opacity="0.3"/>
    <rect x="9" y="9" width="6" height="4" fill="currentColor"/>
    <circle cx="12" cy="11" r="1" fill="white"/>
    <path d="M6 8h12M6 14h12" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);
const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b-4 border-primary-green transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <KaabaIcon className="h-8 w-8 text-primary-green group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-gold rounded-full"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-tajawal">
                Islamic Finder
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Find Peace</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/prayer-times" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-green dark:hover:text-primary-green transition-colors duration-300 font-medium"
            >
              Prayer Times
            </Link>
            <Link 
              to="/masjids" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-green dark:hover:text-primary-green transition-colors duration-300 font-medium"
            >
              Masjids
            </Link>
            <Link 
              to="/hadith" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-green dark:hover:text-primary-green transition-colors duration-300 font-medium"
            >
              Daily Hadith
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/settings"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1 bg-islamic-gold text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-300"
                  >
                    Admin
                  </Link>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-300"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-300" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;