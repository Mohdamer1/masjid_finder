import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { getPrayerTimes, getTimeUntilNextPrayer } from '../../services/prayerTimes';
import { getCurrentLocation } from '../../services/locationService';
import { setTimings, setUserLocation, setLoading, setError } from '../../store/slices/prayerSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Clock, MapPin, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const PrayerTimesCard: React.FC = () => {
  const dispatch = useDispatch();
  const { timings, userLocation, loading, error } = useSelector((state: RootState) => state.prayer);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (timings) {
        setNextPrayerInfo(getTimeUntilNextPrayer(timings));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      dispatch(setLoading(true));
      const location = await getCurrentLocation();
      dispatch(setUserLocation(location));
      
      const prayerTimings = await getPrayerTimes(location.lat, location.lng);
      dispatch(setTimings(prayerTimings));
      
      toast.success('Prayer times updated successfully');
    } catch (err: any) {
      dispatch(setError(err.message));
      toast.error('Failed to fetch prayer times');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const prayerNames = [
    { key: 'fajr', name: 'Fajr', arabic: 'الفجر' },
    { key: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر' },
    { key: 'asr', name: 'Asr', arabic: 'العصر' },
    { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب' },
    { key: 'isha', name: 'Isha', arabic: 'العشاء' }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading prayer times...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPrayerTimes}
            className="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-tajawal">
            Prayer Times
          </h2>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Current Location</span>
          </div>
        </div>
        <button
          onClick={fetchPrayerTimes}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Next Prayer Countdown */}
      {nextPrayerInfo && (
        <div className="bg-gradient-to-r from-primary-green to-green-600 rounded-xl p-6 mb-8 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Next Prayer</h3>
            <p className="text-3xl font-bold mb-2">{nextPrayerInfo.nextPrayer}</p>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-xl font-mono">{nextPrayerInfo.timeRemaining}</span>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      {timings && (
        <div className="space-y-4">
          {prayerNames.map((prayer) => (
            <div
              key={prayer.key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                nextPrayerInfo?.nextPrayer.toLowerCase() === prayer.name.toLowerCase()
                  ? 'bg-green-50 dark:bg-green-900/20 border-primary-green shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  nextPrayerInfo?.nextPrayer.toLowerCase() === prayer.name.toLowerCase()
                    ? 'bg-primary-green'
                    : 'bg-gray-400 dark:bg-gray-500'
                }`}></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {prayer.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                    {prayer.arabic}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {formatTime(timings[prayer.key as keyof typeof timings] as string)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Time */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Time</p>
          <p className="text-lg font-mono text-gray-900 dark:text-white">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesCard;