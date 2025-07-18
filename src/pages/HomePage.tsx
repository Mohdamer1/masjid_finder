import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import PrayerTimesCard from '../components/PrayerTimes/PrayerTimesCard';
import HadithCard from '../components/Hadith/HadithCard';
import { Clock, BookOpen, Users, Shield, Heart, Globe } from 'lucide-react';

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

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const features = [
    {
      icon: Clock,
      title: 'Accurate Prayer Times',
      description: 'Get precise prayer times based on your location with multiple calculation methods',
      link: '/prayer-times'
    },
    {
      icon: KaabaIcon,
      title: 'Find Nearby Masjids',
      description: 'Discover masjids near you with facilities, timings, and contact information',
      link: '/masjids'
    },
    {
      icon: BookOpen,
      title: 'Daily Hadith',
      description: 'Read authentic Hadith collections with Arabic text and translations',
      link: '/hadith'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: KaabaIcon, label: 'Masjids Listed', value: '500+' },
    { icon: Globe, label: 'Cities Covered', value: '100+' },
    { icon: Heart, label: 'Community Rating', value: '4.9★' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-green to-green-700 text-white py-20 px-4 overflow-hidden">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <KaabaIcon className="h-16 w-16 mx-auto mb-4 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-tajawal">
              Islamic Finder
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Your comprehensive Islamic companion for prayer times, masjid locations, 
              and daily spiritual guidance
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!user ? (
              <>
                <Link
                  to="/masjids"
                  className="px-8 py-4 bg-white text-primary-green font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                >
                  Find Nearby Masjids
                </Link>
                <Link
                  to="/prayer-times"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-green transition-colors duration-300"
                >
                  Try Prayer Times
                </Link>
              </>
            ) : (
              <Link
                to="/prayer-times"
                className="px-8 py-4 bg-white text-primary-green font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                View Prayer Times
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-green text-white rounded-lg mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-tajawal">
              Everything You Need for Your Islamic Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive suite of Islamic tools designed to support 
              your daily prayers and spiritual growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-green to-green-600 text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-green transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-tajawal">
              Quick Access
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get instant access to your most-used Islamic tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PrayerTimesCard />
            <HadithCard />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-green mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by the Muslim Community
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Our app follows authentic Islamic sources and is verified by Islamic scholars. 
                We prioritize accuracy, privacy, and respect for Islamic values in everything we do.
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  <span>Authentic Sources</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  <span>Scholar Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;