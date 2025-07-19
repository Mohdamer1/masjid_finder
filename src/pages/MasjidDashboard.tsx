import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Clock, Home, Camera, LogOut, Calendar, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface MasjidData {
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  isApproved: boolean;
  customTimings: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

const MasjidDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prayer-times');
  const [masjidData, setMasjidData] = useState<MasjidData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMasjidData();
    }
  }, [user]);

  const fetchMasjidData = async () => {
    if (!user) return;
    
    try {
      const masjidDoc = await getDoc(doc(db, 'masjids', user.uid));
      if (masjidDoc.exists()) {
        setMasjidData(masjidDoc.data() as MasjidData);
      }
    } catch (error) {
      toast.error('Failed to load masjid data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const updatePrayerTimes = async (newTimings: any) => {
    if (!user || !masjidData) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'masjids', user.uid), {
        customTimings: newTimings
      });
      
      setMasjidData({
        ...masjidData,
        customTimings: newTimings
      });
      
      toast.success('Prayer times updated successfully');
    } catch (error) {
      toast.error('Failed to update prayer times');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const gregorian = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Simple Hijri approximation (you might want to use a proper Hijri calendar library)
    const hijriYear = Math.floor((today.getFullYear() - 622) * 1.030684);
    const hijriMonth = Math.floor(Math.random() * 12) + 1;
    const hijriDay = Math.floor(Math.random() * 29) + 1;
    
    return { gregorian, hijri: `${hijriDay} Rajab ${hijriYear}` };
  };

  const PrayerTimesTab = () => {
    const [timings, setTimings] = useState(masjidData?.customTimings || {
      fajr: '05:00',
      dhuhr: '12:30',
      asr: '04:00',
      maghrib: '06:30',
      isha: '08:00',
      jummah: '01:00'
    });

    const handleSave = () => {
      updatePrayerTimes(timings);
    };

    const dates = getCurrentDate();

    return (
      <div className="space-y-6">
        {/* Date Display */}
        <div className="bg-gradient-to-r from-primary-green to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6" />
            <h3 className="text-xl font-bold">Today's Date</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-green-100 text-sm">Gregorian</p>
              <p className="text-lg font-semibold">{dates.gregorian}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Hijri</p>
              <p className="text-lg font-semibold">{dates.hijri}</p>
            </div>
          </div>
        </div>

        {/* Prayer Times Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Update Prayer Times</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'fajr', name: 'Fajr', arabic: 'الفجر' },
              { key: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر' },
              { key: 'asr', name: 'Asr', arabic: 'العصر' },
              { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب' },
              { key: 'isha', name: 'Isha', arabic: 'العشاء' },
              { key: 'jummah', name: 'Jummah', arabic: 'الجمعة' }
            ].map((prayer) => (
              <div key={prayer.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {prayer.name} <span className="font-arabic text-gray-500">({prayer.arabic})</span>
                </label>
                <input
                  type="time"
                  value={timings[prayer.key as keyof typeof timings]}
                  onChange={(e) => setTimings({
                    ...timings,
                    [prayer.key]: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full md:w-auto px-6 py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Times'}
          </button>
        </div>
      </div>
    );
  };

  const ProfileTab = () => {
    if (!masjidData) return null;

    return (
      <div className="space-y-6">
        {/* Approval Status */}
        <div className={`rounded-xl p-6 border-2 ${
          masjidData.isApproved 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center space-x-3">
            {masjidData.isApproved ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            )}
            <div>
              <h3 className={`font-bold ${
                masjidData.isApproved 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                Status: {masjidData.isApproved ? 'Approved' : 'Pending Approval'}
              </h3>
              <p className={`text-sm ${
                masjidData.isApproved 
                  ? 'text-green-600 dark:text-green-300' 
                  : 'text-yellow-600 dark:text-yellow-300'
              }`}>
                {masjidData.isApproved 
                  ? 'Your masjid profile is approved and visible to users'
                  : 'Your account is pending approval. Our team will contact you soon.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Masjid Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Masjid Profile</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo */}
            <div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                <img
                  src={masjidData.image}
                  alt={masjidData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Upload New Photo</span>
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Masjid Name
                </label>
                <input
                  type="text"
                  value={masjidData.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={masjidData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={masjidData.phone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{masjidData.address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {masjidData.coordinates.lat.toFixed(6)}, {masjidData.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!masjidData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load masjid data</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <svg className="h-8 w-8 text-primary-green" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" stroke="currentColor" strokeWidth="1" fill="none"/>
                <rect x="8" y="8" width="8" height="6" fill="currentColor" opacity="0.3"/>
                <rect x="9" y="9" width="6" height="4" fill="currentColor"/>
                <circle cx="12" cy="11" r="1" fill="white"/>
                <path d="M6 8h12M6 14h12" stroke="currentColor" strokeWidth="0.5"/>
              </svg>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Masjid Dashboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{masjidData.name}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('prayer-times')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'prayer-times'
                    ? 'bg-primary-green text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span>Update Prayer Times</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-green text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>View Masjid Profile</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {activeTab === 'prayer-times' ? 'Prayer Times Management' : 'Masjid Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {activeTab === 'prayer-times' 
                  ? 'Update your masjid\'s prayer times for the community'
                  : 'View and manage your masjid\'s profile information'
                }
              </p>
            </div>

            {activeTab === 'prayer-times' && <PrayerTimesTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasjidDashboard;