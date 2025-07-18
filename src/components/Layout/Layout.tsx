import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mode } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${mode === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-sky-50 to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;