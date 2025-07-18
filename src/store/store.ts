import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import prayerSlice from './slices/prayerSlice';
import masjidSlice from './slices/masjidSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    prayer: prayerSlice,
    masjid: masjidSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;