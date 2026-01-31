
import { useCallback, useState } from 'react';
import { Language } from '../types';

const LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  ml: 'ml-IN'
};

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, lang: Language = 'en') => {
    if (!window.speechSynthesis) return;

    // Stop existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[lang] || 'en-US';
    utterance.rate = 0.9; // Optimal for clarity
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
