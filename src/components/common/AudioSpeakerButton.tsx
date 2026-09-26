import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking } from '../../utils/speech';
import { useLanguage } from '../../context/LanguageContext';

export const AudioSpeakerButton: React.FC<{
  textToSpeak: string;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ textToSpeak, size = 'sm', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language, t } = useLanguage();

  const handleToggle = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakText(textToSpeak, language);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-xl border transition-all ${
        isPlaying 
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse' 
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
      } ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'} ${className}`}
      title={isPlaying ? t.stopAudio : t.listenAudio}
    >
      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
      <span>{isPlaying ? t.stopAudio : t.listenAudio}</span>
    </button>
  );
};
