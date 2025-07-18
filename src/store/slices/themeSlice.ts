import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
  language: 'en' | 'ar' | 'ur';
}

const initialState: ThemeState = {
  mode: 'light',
  language: 'en',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ar' | 'ur'>) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;