import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/config';
import { MapPin, Phone, Mail, Lock, Upload, Camera, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../services/locationService';
import { signOut } from 'firebase/auth';

const RegisterMasjidPage: React.FC = () => {
  const [formData, setFormData] = useState({
    masjidName: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    mobileNumber: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detectedArea, setDetectedArea] = useState('');
  const [detectedCity, setDetectedCity] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setFormData({
            ...formData,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
          toast.success('Location detected successfully');
          // Convert lat/lng to area/city
          const { area, city } = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          // Filter out unwanted area names like 'Ward'
          let filteredArea = area;
          if (filteredArea && filteredArea.toLowerCase().startsWith('ward')) {
            filteredArea = '';
          }
          setDetectedArea(filteredArea);
          setDetectedCity(city);
        },
        (error) => {
          toast.error('Failed to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ensure location is selected
    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      toast.error('Please select your masjid location before creating an account.');
      setLoading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save masjid data to Firestore (no photo)
      await setDoc(doc(db, 'masjids', userCredential.user.uid), {
        name: formData.masjidName,
        address: detectedArea && detectedCity ? `${detectedArea}, ${detectedCity}` : detectedCity || detectedArea || formData.location,
        coordinates: formData.coordinates,
        phone: formData.mobileNumber,
        email: formData.email,
        image: 'https://images.pexels.com/photos/3250364/pexels-photo-3250364.jpeg',
        verified: false,
        isApproved: false,
        admin: userCredential.user.uid,
        createdAt: new Date(),
        facilities: ['Parking', 'Wudu', 'AC'],
        customTimings: {
          fajr: '05:00',
          dhuhr: '12:30',
          asr: '04:00',
          maghrib: '06:30',
          isha: '08:00',
          jummah: '01:00'
        }
      });

      // Save user data
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: formData.masjidName + ' Admin',
        email: formData.email,
        isMasjidAdmin: true,
        isApproved: false,
        masjidId: userCredential.user.uid,
        createdAt: new Date(),
        password: formData.password
      });

      // Sign out the user and show pending approval message
      await signOut(auth);
      setPendingApproval(true);
      setShowSuccessDialog(false);
      setShowModal(true);
      setLoading(false);
      // Clear form fields
      setFormData({
        masjidName: '',
        location: '',
        coordinates: { lat: 0, lng: 0 },
        mobileNumber: '',
        email: '',
        password: ''
      });
      setDetectedArea('');
      setDetectedCity('');
      return;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const SuccessDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Account Request Submitted
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your account request has been submitted. Please wait for verification. 
            Our team will contact you via phone or email to approve your masjid profile.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-sky-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Modal for pending approval */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-yellow-50 border-l-8 border-yellow-500 rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
            <p className="text-yellow-900 mb-6 font-medium">
              Your masjid account has been created and is <b>pending admin approval</b>.<br/>
              You will receive an email or notification once your account is approved and you can log in.
            </p>
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-green text-white rounded-2xl mb-4">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" stroke="currentColor" strokeWidth="1" fill="none"/>
              <rect x="8" y="8" width="8" height="6" fill="currentColor" opacity="0.3"/>
              <rect x="9" y="9" width="6" height="4" fill="currentColor"/>
              <circle cx="12" cy="11" r="1" fill="white"/>
              <path d="M6 8h12M6 14h12" stroke="currentColor" strokeWidth="0.5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-tajawal mb-2">
            Register Your Masjid
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join our network and manage your masjid's information
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {pendingApproval && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
              <p className="font-semibold">Your masjid account has been created and is pending approval by an admin. You will be able to log in once your account is approved.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Masjid Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Masjid Name *
              </label>
              <input
                type="text"
                name="masjidName"
                value={formData.masjidName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter masjid name"
                required
              />
            </div>

            {/* Location Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Masjid Location *
              </label>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Use My Current Location
                </button>
                {formData.coordinates.lat !== 0 && formData.coordinates.lng !== 0 && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>Latitude: {formData.coordinates.lat.toFixed(6)}</div>
                    <div>Longitude: {formData.coordinates.lng.toFixed(6)}</div>
                    <div>Area: {detectedArea ? detectedArea : 'Not available'}</div>
                    {detectedCity && <div>City: {detectedCity}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Masjid Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && <SuccessDialog />}
    </div>
  );
};

export default RegisterMasjidPage;