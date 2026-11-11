import React, { useState, useEffect, useCallback } from 'react';

export interface VoiceAccessibilityProps {
  textToRead?: string;
  textToSpeak?: string;
  onVoiceResult?: (transcript: string) => void;
  onVoiceQuery?: (transcript: string) => void;
  className?: string;
  showSpeechInput?: boolean;
  isSearchMode?: boolean;
  label?: string;
}

export const VoiceAccessibility: React.FC<VoiceAccessibilityProps> = ({
  textToRead,
  textToSpeak,
  onVoiceResult,
  onVoiceQuery,
  className = '',
  showSpeechInput = false,
  isSearchMode = false,
  label,
}) => {
  const activeText = textToRead || textToSpeak;
  const activeCallback = onVoiceResult || onVoiceQuery;
  const shouldShowSTT = showSpeechInput || isSearchMode;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSttSupported(true);
    }
  }, []);

  const handleSpeak = useCallback(() => {
    if (!ttsSupported || !activeText) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(activeText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95; // Slightly slower, clear cadence for rural farmers
      utterance.pitch = 1.0;

      // Find best Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('HI') || v.name.includes('Hindi')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  }, [ttsSupported, activeText, isSpeaking]);

  const handleListen = useCallback(() => {
    if (!sttSupported || !activeCallback) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('सुन रहे हैं, कृपया बोलिए...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          activeCallback(transcript);
          setStatusMessage(`पहचाना गया: "${transcript}"`);
          setTimeout(() => setStatusMessage(null), 3000);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setStatusMessage('माइक्रोफ़ोन की अनुमति नहीं मिली या आवाज समझ नहीं आई');
        setTimeout(() => setStatusMessage(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
      setIsListening(false);
    }
  }, [sttSupported, activeCallback]);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Read Aloud Button */}
      {ttsSupported && activeText && (
        <button
          type="button"
          onClick={handleSpeak}
          aria-label={isSpeaking ? 'आवाज बंद करें (Stop reading)' : 'बोलकर सुनाएं (Read aloud)'}
          title={isSpeaking ? 'बोलना बंद करें' : 'यह जानकारी बोलकर सुनें'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isSpeaking
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span className="text-sm">🔊</span>
          <span>{isSpeaking ? 'रोकें' : label || 'सुनें (Audio)'}</span>
        </button>
      )}

      {/* Hindi Speech-to-Text Input Button */}
      {shouldShowSTT && sttSupported && activeCallback && (
        <button
          type="button"
          onClick={handleListen}
          disabled={isListening}
          aria-label="बोलकर खोजें (Voice input)"
          title="बोलकर खोजें (Hindi Voice Search)"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isListening
              ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
          }`}
        >
          <span className="text-sm">🎙️</span>
          <span>{isListening ? 'बोलिए...' : label || 'बोलकर खोजें'}</span>
        </button>
      )}

      {statusMessage && (
        <span className="text-[11px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
          {statusMessage}
        </span>
      )}
    </div>
  );
};
