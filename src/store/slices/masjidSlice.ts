import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Masjid } from '../../types';

interface MasjidState {
  masjids: Masjid[];
  selectedMasjid: Masjid | null;
  favorites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MasjidState = {
  masjids: [],
  selectedMasjid: null,
  favorites: [],
  loading: false,
  error: null,
};

const masjidSlice = createSlice({
  name: 'masjid',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMasjids: (state, action: PayloadAction<Masjid[]>) => {
      state.masjids = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedMasjid: (state, action: PayloadAction<Masjid | null>) => {
      state.selectedMasjid = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setLoading, 
  setMasjids, 
  setSelectedMasjid, 
  addToFavorites, 
  removeFromFavorites, 
  setError 
} = masjidSlice.actions;
export default masjidSlice.reducer;