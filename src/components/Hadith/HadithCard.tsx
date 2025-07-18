import React, { useState, useEffect } from 'react';
import { getDailyHadith } from '../../services/hadithService';
import { Hadith } from '../../types';
import LoadingSpinner from '../Common/LoadingSpinner';
import { BookOpen, Share2, Heart, RefreshCw, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const HadithCard: React.FC = () => {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchHadith();
  }, []);

  const fetchHadith = async () => {
    try {
      setLoading(true);
      const dailyHadith = await getDailyHadith();
      setHadith(dailyHadith);
    } catch (error) {
      toast.error('Failed to fetch hadith');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!hadith) return;
    
    const shareText = `"${hadith.englishText}"\n\n- ${hadith.narrator}\nSource: ${hadith.collection}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Hadith',
          text: shareText,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Hadith copied to clipboard');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success('Hadith copied to clipboard');
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleCopy = () => {
    if (!hadith) return;
    
    const copyText = `${hadith.englishText}\n\nArabic: ${hadith.arabicText}\n\nNarrator: ${hadith.narrator}\nSource: ${hadith.collection}`;
    navigator.clipboard.writeText(copyText);
    toast.success('Hadith copied to clipboard');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading hadith...</span>
        </div>
      </div>
    );
  }

  if (!hadith) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No hadith available</p>
          <button
            onClick={fetchHadith}
            className="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-green to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold font-tajawal">Daily Hadith</h2>
              <p className="text-green-100 text-sm">{hadith.collection}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Copy hadith"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark hadith'}
            >
              <Heart className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Share hadith"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={fetchHadith}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Get new hadith"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Arabic Text */}
        <div className="mb-8 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-r-4 border-islamic-gold">
            <p className="text-2xl font-arabic text-gray-900 dark:text-white leading-relaxed text-right" dir="rtl">
              {hadith.arabicText}
            </p>
          </div>
        </div>

        {/* English Translation */}
        <div className="mb-8">
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-primary-green pl-6 bg-green-50 dark:bg-green-900/20 p-6 rounded-r-xl">
            "{hadith.englishText}"
          </blockquote>
        </div>

        {/* Hadith Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Narrator:</span> {hadith.narrator}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Number:</span> {hadith.hadithNumber}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Collection:</span> {hadith.collection}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Book:</span> {hadith.book}
            </div>
          </div>
        </div>

        {/* Islamic Pattern Border */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-islamic-gold">
              <div className="w-2 h-2 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-2 h-2 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-2 h-2 bg-current rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HadithCard;