import React from 'react';
import PrayerTimesCard from '../components/PrayerTimes/PrayerTimesCard';

const PrayerTimesPage: React.FC = () => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4 flex flex-col">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-tajawal">
          Prayer Times
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Accurate prayer times based on your current location
        </p>
      </div>
      
      <PrayerTimesCard />
    </div>
  );
};

export default PrayerTimesPage;