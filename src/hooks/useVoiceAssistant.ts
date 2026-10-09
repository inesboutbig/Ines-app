import { useState, useEffect, useRef, useCallback } from 'react';
import { Language, ChatMessage } from '../types';
import { sendVoiceChatMessage, synthesizeSpeech } from '../services/api';
import { audioPlayer } from '../services/audioPlayer';

export function useVoiceAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Zephyr'>('Kore');
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>([10, 20, 15, 30, 25, 40, 30, 15]);

  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize welcome greeting
  useEffect(() => {
    const welcomeText =
      "Hello and welcome. I am the voice ambassador for Inès Boutbig. Combining a Master in Luxury Marketing at ESCE Paris, interior architecture sensibility, and luxury retail experience at Galeries Lafayette, Inès is eager to contribute to your boutique's client excellence. How may I introduce her credentials to you?";

    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: welcomeText,
        language: 'en',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Visualizer loop when speaking or listening
  useEffect(() => {
    const updateVisualizer = () => {
      if (isSpeaking) {
        const raw = audioPlayer.getFrequencyData();
        const sampled: number[] = [];
        const step = Math.max(1, Math.floor(raw.length / 12));
        for (let i = 0; i < 12; i++) {
          const val = raw[i * step] || 0;
          sampled.push(val);
        }
        setFrequencyData(sampled);
      } else if (isListening) {
        // Simulated responsive breathing wave while microphone is active
        const time = Date.now() / 150;
        const wave = Array.from({ length: 12 }, (_, i) => {
          return 30 + Math.sin(time + i * 0.6) * 25 + Math.random() * 15;
        });
        setFrequencyData(wave);
      } else {
        // Idle gentle pulse
        setFrequencyData([12, 18, 14, 22, 16, 26, 20, 15, 18, 12, 14, 10]);
      }

      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSpeaking, isListening]);

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap: Record<Language, string> = {
        en: 'en-US',
        fr: 'fr-FR',
        ar: 'ar-SA',
        es: 'es-ES',
      };
      recognition.lang = langMap[selectedLanguage];

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setCurrentTranscript(finalTranscript);
            askQuestion(finalTranscript);
          } else {
            interim += event.results[i][0].transcript;
            setCurrentTranscript(interim);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        if (e.error !== 'no-speech') {
          setError(`Microphone: ${e.error || 'Check browser permissions'}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [selectedLanguage]);

  const startListening = useCallback(() => {
    setError(null);
    if (audioPlayer.getIsPlaying()) {
      audioPlayer.stop();
      setIsSpeaking(false);
    }

    if (recognitionRef.current) {
      try {
        const langMap: Record<Language, string> = {
          en: 'en-US',
          fr: 'fr-FR',
          ar: 'ar-SA',
          es: 'es-ES',
        };
        recognitionRef.current.lang = langMap[selectedLanguage];
        recognitionRef.current.start();
      } catch (err: any) {
        console.warn('Recognition start failed:', err);
        setError('Could not start microphone. Please check permissions.');
        setIsListening(false);
      }
    } else {
      setError('Voice recognition is not supported in this browser. You can type or use preset interview questions.');
    }
  }, [selectedLanguage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    audioPlayer.stop();
    setIsSpeaking(false);
  }, []);

  // Main asking method
  const askQuestion = useCallback(
    async (questionText: string, langOverride?: Language) => {
      if (!questionText.trim()) return;

      const lang = langOverride || selectedLanguage;
      setError(null);
      stopSpeaking();
      setCurrentTranscript('');

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: questionText.trim(),
        language: lang,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await sendVoiceChatMessage(questionText, lang, messages, selectedVoice);

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: response.text,
          audioBase64: response.audioBase64,
          language: lang,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Auto play audio if available
        if (response.audioBase64) {
          await audioPlayer.playBase64(response.audioBase64, 'audio/wav', {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: (err) => {
              console.warn('Audio playback error:', err);
              setIsSpeaking(false);
            },
          });
        }
      } catch (err: any) {
        console.error('Failed to get answer:', err);
        setError(err?.message || 'Unable to connect to Inès voice server.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, selectedLanguage, selectedVoice, stopSpeaking]
  );

  const replayMessage = useCallback(
    async (message: ChatMessage) => {
      setError(null);
      stopSpeaking();

      try {
        if (message.audioBase64) {
          await audioPlayer.playBase64(message.audioBase64, 'audio/wav', {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        } else {
          // Synthesize on the fly
          setIsLoading(true);
          const tts = await synthesizeSpeech(message.content, selectedVoice, message.language || selectedLanguage);
          message.audioBase64 = tts.audioBase64;
          await audioPlayer.playBase64(tts.audioBase64, 'audio/wav', {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
      } catch (e: any) {
        console.warn('Playback error:', e);
        setError('Failed to play audio.');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedVoice, selectedLanguage, stopSpeaking]
  );

  return {
    messages,
    isListening,
    isSpeaking,
    isLoading,
    currentTranscript,
    selectedLanguage,
    selectedVoice,
    error,
    frequencyData,
    setSelectedLanguage,
    setSelectedVoice,
    startListening,
    stopListening,
    stopSpeaking,
    askQuestion,
    replayMessage,
  };
}
