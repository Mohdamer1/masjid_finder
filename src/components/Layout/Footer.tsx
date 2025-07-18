import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

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

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <KaabaIcon className="h-8 w-8 text-primary-green" />
              <h3 className="text-xl font-bold font-tajawal">Islamic Finder</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your comprehensive Islamic companion app for finding masjids, 
              prayer times, Qiblah direction, and daily Islamic content.
            </p>
            <div className="text-sm text-gray-400">
              <p className="mb-2">Built with ❤️ for the Muslim community</p>
              <p>Free • Open Source • Privacy First</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-islamic-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/prayer-times" className="text-gray-300 hover:text-primary-green transition-colors">
                  Prayer Times
                </Link>
              </li>
              <li>
                <Link to="/masjids" className="text-gray-300 hover:text-primary-green transition-colors">
                  Find Masjids
                </Link>
              </li>
              <li>
                <Link to="/hadith" className="text-gray-300 hover:text-primary-green transition-colors">
                  Daily Hadith
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-islamic-gold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-primary-green transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-primary-green transition-colors">
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-primary-green transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-primary-green transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Islamic Finder. All rights reserved. • Made with{' '}
            <Heart className="inline h-4 w-4 text-red-500" />{' '}
            for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;