import axios from 'axios';
import { PrayerTimings } from '../types';

const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (
  latitude: number,
  longitude: number,
  method: number = 2
): Promise<PrayerTimings> => {
  try {
    const response = await axios.get(
      `${ALADHAN_BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=1`
    );
    
    const timings = response.data.data.timings;
    
    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw new Error('Failed to fetch prayer times');
  }
};

export const getQiblahDirection = async (
  latitude: number,
  longitude: number
): Promise<number> => {
  try {
    const response = await axios.get(
      `${ALADHAN_BASE_URL}/qibla/${latitude}/${longitude}`
    );
    
    return response.data.data.direction;
  } catch (error) {
    console.error('Error fetching Qiblah direction:', error);
    throw new Error('Failed to fetch Qiblah direction');
  }
};

export const getTimeUntilNextPrayer = (timings: PrayerTimings): {
  nextPrayer: string;
  timeRemaining: string;
  minutes: number;
} => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayerTimes = [
    { name: 'Fajr', time: timings.fajr },
    { name: 'Dhuhr', time: timings.dhuhr },
    { name: 'Asr', time: timings.asr },
    { name: 'Maghrib', time: timings.maghrib },
    { name: 'Isha', time: timings.isha }
  ];
  
  for (const prayer of prayerTimes) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentTime) {
      const diff = prayerMinutes - currentTime;
      const hoursLeft = Math.floor(diff / 60);
      const minutesLeft = diff % 60;
      
      return {
        nextPrayer: prayer.name,
        timeRemaining: `${hoursLeft}h ${minutesLeft}m`,
        minutes: diff
      };
    }
  }
  
  // If no prayer found today, next is Fajr tomorrow
  const [hours, minutes] = timings.fajr.split(':').map(Number);
  const fajrMinutes = hours * 60 + minutes;
  const diff = (24 * 60) - currentTime + fajrMinutes;
  const hoursLeft = Math.floor(diff / 60);
  const minutesLeft = diff % 60;
  
  return {
    nextPrayer: 'Fajr',
    timeRemaining: `${hoursLeft}h ${minutesLeft}m`,
    minutes: diff
  };
};