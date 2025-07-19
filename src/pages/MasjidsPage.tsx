import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { getCurrentLocation, calculateDistance, getDrivingDistance, reverseGeocode } from '../services/locationService';
import { setMasjids, setLoading, setError } from '../store/slices/masjidSlice';
import { setUserLocation } from '../store/slices/prayerSlice';
import { Masjid } from '../types';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { MapPin, Phone, Star, Navigation, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// Extend Masjid type locally to include areaName
type MasjidWithArea = Masjid & { areaName: string };

const MasjidsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { masjids, loading, error } = useSelector((state: RootState) => state.masjid);
  const { userLocation } = useSelector((state: RootState) => state.prayer);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    fetchMasjids();
  }, []);

  const fetchMasjids = async () => {
    try {
      dispatch(setLoading(true));
      // Get user location
      let location;
      try {
        location = await getCurrentLocation();
        dispatch(setUserLocation(location));
        setLocationError(null);
      } catch (err: any) {
        setLocationError('Please enable your location to find nearby masjids.');
        dispatch(setLoading(false));
        return;
      }
      // Fetch masjids from Firestore
      const querySnapshot = await getDocs(collection(db, 'masjids'));
      const masjidsFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Calculate driving distances and get area/city for each masjid
      const masjidsWithDistance: MasjidWithArea[] = await Promise.all(
        masjidsFromDb.map(async (masjid: any) => {
          let distance = null;
          let areaName: string = '';
          if (masjid.coordinates) {
            distance = await getDrivingDistance(
              location.lat,
              location.lng,
              masjid.coordinates.lat,
              masjid.coordinates.lng
            );
            areaName = (await reverseGeocode(
              masjid.coordinates.lat,
              masjid.coordinates.lng
            )) || '';
          }
          return { ...masjid, distance, areaName };
        })
      );
      masjidsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      dispatch(setMasjids(masjidsWithDistance));
      toast.success('Nearby masjids found!');
    } catch (err: any) {
      dispatch(setError(err.message));
      toast.error('Failed to find masjids');
    }
  };

  const filteredMasjids = masjids.filter(masjid => {
    const matchesSearch = masjid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         masjid.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFacilities = selectedFacilities.length === 0 ||
                             selectedFacilities.every(facility => 
                               masjid.facilities.includes(facility)
                             );
    
    return matchesSearch && matchesFacilities && masjid.isApproved === true;
  });

  const allFacilities = [...new Set(masjids.flatMap(m => m.facilities))];

  const getDirections = (masjid: Masjid) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${masjid.coordinates.lat},${masjid.coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Finding nearby masjids...</span>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center py-24">
          <span className="text-red-600 text-lg font-semibold">{locationError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-tajawal">
          Find Nearby Masjids
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover masjids near you with facilities, timings, and contact information
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Masjids
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search by name or address..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMasjids.map(masjid => (
          <div
            key={masjid.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-tajawal">
                {masjid.name}
              </h3>
              
              <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{masjid.address}</span>
              </div>

              {/* Driving Distance */}
              {masjid.distance !== null && masjid.distance !== undefined && (
                <div className="mb-4 flex items-center text-primary-green font-semibold text-sm">
                  <Navigation className="h-4 w-4 mr-1" />
                  {masjid.distance} km by road
                </div>
              )}

              {/* Prayer Times */}
              {masjid.customTimings && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Prayer Times:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-white">Fajr:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.fajr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-white">Dhuhr:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.dhuhr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-white">Asr:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.asr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-white">Maghrib:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.maghrib}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-white">Isha:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.isha}</span>
                    </div>
                    {masjid.customTimings.jummah && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-white">Jummah:</span>
                        <span className="font-mono text-gray-900 dark:text-white">{masjid.customTimings.jummah}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => getDirections(masjid)}
                  className="flex-1 bg-primary-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMasjids.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No masjids found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try adjusting your search criteria or check back later.
          </p>
          <button
            onClick={fetchMasjids}
            className="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Search
          </button>
        </div>
      )}
    </div>
  );
};

export default MasjidsPage;