import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrayerTimings } from '../../types';

interface PrayerState {
  timings: PrayerTimings | null;
  qiblahDirection: number | null;
  userLocation: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrayerState = {
  timings: null,
  qiblahDirection: null,
  userLocation: null,
  loading: false,
  error: null,
};

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTimings: (state, action: PayloadAction<PrayerTimings>) => {
      state.timings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setQiblahDirection: (state, action: PayloadAction<number>) => {
      state.qiblahDirection = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.userLocation = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setTimings, setQiblahDirection, setUserLocation, setError } = prayerSlice.actions;
export default prayerSlice.reducer;