import axios from 'axios';
import { Hadith } from '../types';

// Using a free Hadith API that doesn't require authentication
const HADITH_API_BASE = 'https://api.sunnah.com/v1';

// Fallback hadiths for when API is unavailable
const fallbackHadiths: Hadith[] = [
  {
    hadithNumber: '1',
    englishText: 'Actions are but by intention and every man shall have only that which he intended.',
    arabicText: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    collection: 'Sahih Bukhari',
    book: 'Book of Revelation',
    narrator: 'Umar ibn al-Khattab (RA)'
  },
  {
    hadithNumber: '2',
    englishText: 'None of you truly believes until he loves for his brother what he loves for himself.',
    arabicText: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    collection: 'Sahih Bukhari',
    book: 'Book of Faith',
    narrator: 'Anas ibn Malik (RA)'
  },
  {
    hadithNumber: '3',
    englishText: 'The believer is not one who eats his fill while his neighbor goes hungry.',
    arabicText: 'لَيْسَ الْمُؤْمِنُ الَّذِي يَشْبَعُ وَجَارُهُ جَائِعٌ',
    collection: 'Al-Adab Al-Mufrad',
    book: 'Book of Neighbors',
    narrator: 'Ibn Abbas (RA)'
  },
  {
    hadithNumber: '4',
    englishText: 'The best of people are those who benefit others.',
    arabicText: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    collection: 'Al-Mu\'jam al-Awsat',
    book: 'Book of Good Character',
    narrator: 'Jabir ibn Abdullah (RA)'
  },
  {
    hadithNumber: '5',
    englishText: 'A good word is charity.',
    arabicText: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    collection: 'Sahih Bukhari',
    book: 'Book of Jihad',
    narrator: 'Abu Hurairah (RA)'
  },
  {
    hadithNumber: '6',
    englishText: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    arabicText: 'مَن كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    collection: 'Sahih Bukhari',
    book: 'Book of Good Manners',
    narrator: 'Abu Hurairah (RA)'
  },
  {
    hadithNumber: '7',
    englishText: 'The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.',
    arabicText: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    collection: 'Sahih Bukhari',
    book: 'Book of Good Manners',
    narrator: 'Abu Hurairah (RA)'
  },
  {
    hadithNumber: '8',
    englishText: 'Be in this world as if you were a stranger or a traveler along a path.',
    arabicText: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    collection: 'Sahih Bukhari',
    book: 'Book of Heart-Melting Traditions',
    narrator: 'Abdullah ibn Umar (RA)'
  }
];

let currentHadithIndex = 0;
export const getDailyHadith = async (): Promise<Hadith> => {
  // Use fallback hadiths directly to avoid CORS issues
  const hadith = fallbackHadiths[currentHadithIndex];
  currentHadithIndex = (currentHadithIndex + 1) % fallbackHadiths.length;
  return hadith;
};

export const getHadithByCollection = async (
  collection: string,
  book: number = 1,
  hadithNumber: number = 1
): Promise<Hadith> => {
  try {
    const response = await axios.get(
      `${HADITH_API_BASE}/hadiths?collection=${collection}&book=${book}&hadithStartNumber=${hadithNumber}&hadithEndNumber=${hadithNumber}`
    );
    
    const hadithData = response.data.hadiths[0];
    
    return {
      hadithNumber: hadithData.hadithNumber,
      englishText: hadithData.englishText,
      arabicText: hadithData.arabicText || 'Arabic text not available',
      collection: hadithData.collection,
      book: hadithData.book,
      narrator: hadithData.narrator || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching hadith by collection:', error);
    throw new Error('Failed to fetch hadith');
  }
};