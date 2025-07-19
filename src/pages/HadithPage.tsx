import React from 'react';
import HadithCard from '../components/Hadith/HadithCard';

const HadithPage: React.FC = () => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4 flex flex-col">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-tajawal">
          Daily Hadith
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Read authentic Hadith collections with Arabic text and translations
        </p>
      </div>
      
      <HadithCard />
    </div>
  );
};

export default HadithPage;