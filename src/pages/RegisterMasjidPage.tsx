import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/config';
import { MapPin, Phone, Mail, Lock, Upload, Camera, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterMasjidPage: React.FC = () => {
  const [formData, setFormData] = useState({
    masjidName: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    mobileNumber: '',
    email: '',
    password: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
          toast.success('Location detected successfully');
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

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      let photoURL = '';
      
      // Upload photo if provided
      if (photo) {
        const photoRef = ref(storage, `masjid-images/${userCredential.user.uid}/${photo.name}`);
        const snapshot = await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Save masjid data to Firestore
      await setDoc(doc(db, 'masjids', userCredential.user.uid), {
        name: formData.masjidName,
        address: formData.location,
        coordinates: formData.coordinates,
        phone: formData.mobileNumber,
        email: formData.email,
        image: photoURL || 'https://images.pexels.com/photos/3250364/pexels-photo-3250364.jpeg',
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
        createdAt: new Date()
      });

      setShowSuccessDialog(true);
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

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Masjid Location *
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter address or coordinates"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Auto-detect location"
                >
                  <MapPin className="h-5 w-5" />
                </button>
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

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Masjid Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-green transition-colors">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Upload className="h-5 w-5" />
                      <span>{photo ? photo.name : 'Choose photo'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {photoPreview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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