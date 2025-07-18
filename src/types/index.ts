export interface Masjid {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: number;
  facilities: string[];
  phone: string;
  image: string;
  verified: boolean;
  customTimings?: PrayerTimings;
  announcements?: string;
  admin?: string;
  isApproved?: boolean;
  createdAt?: any;
}

export interface PrayerTimings {
  fajr: string;
  sunrise?: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah?: string;
}

export interface UserPreferences {
  userId: string;
  defaultMasjid?: string;
  calculationMethod: number;
  theme: 'light' | 'dark';
  language: 'en' | 'ar' | 'ur';
  notifications: {
    fajr: { enabled: boolean; minutesBefore: number };
    dhuhr: { enabled: boolean; minutesBefore: number };
    asr: { enabled: boolean; minutesBefore: number };
    maghrib: { enabled: boolean; minutesBefore: number };
    isha: { enabled: boolean; minutesBefore: number };
    jummah: { enabled: boolean; minutesBefore: number };
  };
  favoriteMasjids: string[];
}

export interface Hadith {
  hadithNumber: string;
  englishText: string;
  arabicText: string;
  collection: string;
  book: string;
  narrator: string;
}

export interface Announcement {
  id: string;
  masjidId: string;
  title: string;
  content: string;
  type: 'jummah' | 'event' | 'emergency';
  publishDate: any;
  expiryDate: any;
  createdBy: string;
}

export interface QiblahDirection {
  latitude: number;
  longitude: number;
  direction: number;
}