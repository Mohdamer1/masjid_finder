import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { auth, db } from './firebase/config';
import { setUser } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import MasjidsPage from './pages/MasjidsPage';
import HadithPage from './pages/HadithPage';
import RegisterMasjidPage from './pages/RegisterMasjidPage';
import MasjidDashboard from './pages/MasjidDashboard';

function AppContent() {
  useEffect(() => {
    // Authentication listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        store.dispatch(setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: userData?.displayName || user.displayName || '',
          isAdmin: userData?.isAdmin || false
        }));
      } else {
        store.dispatch(setUser(null));
      }
    });

    // Disable the default context menu globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup function
    return () => {
      unsubscribe();
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/prayer-times" element={<PrayerTimesPage />} />
          <Route path="/masjids" element={<MasjidsPage />} />
          <Route path="/hadith" element={<HadithPage />} />
          <Route path="/register-masjid" element={<RegisterMasjidPage />} />
          <Route path="/dashboard" element={<MasjidDashboard />} />
        </Routes>
      </Layout>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#28A745',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;