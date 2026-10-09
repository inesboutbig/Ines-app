import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  PhoneCall,
  PhoneOff,
  Radio,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { INES_CV_DATA, PRESET_QUESTIONS } from '../data/cvData';
import { AudioWaveform } from './AudioWaveform';
import { LanguageSelector } from './LanguageSelector';

interface VoiceAssistantPanelProps {
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  currentTranscript: string;
  selectedLanguage: Language;
  selectedVoice: 'Kore' | 'Zephyr';
  error: string | null;
  frequencyData: number[];
  onSelectLanguage: (lang: Language) => void;
  onSelectVoice: (voice: 'Kore' | 'Zephyr') => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onAskQuestion: (q: string, lang?: Language) => void;
  onReplayMessage: (msg: ChatMessage) => void;
  // Live session props
  isLiveActive?: boolean;
  liveStatus?: string;
  isLiveModelSpeaking?: boolean;
  onStartLiveSession?: () => void;
  onStopLiveSession?: () => void;
}

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  messages,
  isListening,
  isSpeaking,
  isLoading,
  currentTranscript,
  selectedLanguage,
  selectedVoice,
  error,
  frequencyData,
  onSelectLanguage,
  onSelectVoice,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onAskQuestion,
  onReplayMessage,
  isLiveActive = false,
  liveStatus = 'idle',
  isLiveModelSpeaking = false,
  onStartLiveSession,
  onStopLiveSession,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, currentTranscript]);

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    onAskQuestion(typedInput.trim(), selectedLanguage);
    setTypedInput('');
  };

  const handlePlayGreeting = (lang: Language) => {
    const langData = INES_CV_DATA.languages.find((l) => l.code === lang);
    if (langData) {
      onAskQuestion(langData.audioGreetingText, lang);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const activeSpeaking = isSpeaking || isLiveModelSpeaking;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Luxury Ambassador Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C1A17] via-[#23201C] to-[#181614] text-white p-6 md:p-8 shadow-2xl border border-amber-900/30">
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Portrait with Animated Voice Aura */}
          <div className="relative flex-shrink-0">
            {/* Concentric Pulses when Ines is speaking */}
            {activeSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-amber-300/40 animate-pulse" />
                <div className="absolute -inset-4 rounded-full border border-amber-400/20 animate-pulse" style={{ animationDuration: '2s' }} />
              </>
            )}

            {isListening && (
              <div className="absolute -inset-3 rounded-full border-2 border-rose-500/60 animate-pulse" />
            )}

            <div
              className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden p-1 shadow-2xl transition-all duration-300 ${
                activeSpeaking
                  ? 'ring-4 ring-amber-400 shadow-[0_0_35px_rgba(212,175,55,0.4)] scale-105'
                  : isListening
                  ? 'ring-4 ring-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                  : 'ring-2 ring-amber-600/40 hover:ring-amber-500/80'
              }`}
            >
              <img
                src={INES_CV_DATA.personal.portraitUrl}
                alt={INES_CV_DATA.personal.fullName}
                className="w-full h-full object-cover object-top rounded-full bg-stone-900"
                onError={(e) => {
                  // Fallback placeholder if asset load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Live Indicator Pill */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 backdrop-blur-md border border-amber-500/40 rounded-full text-[11px] font-semibold tracking-wider text-amber-300 shadow-md">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeSpeaking
                    ? 'bg-amber-400 animate-ping'
                    : isListening
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-emerald-400'
                }`}
              />
              <span>
                {activeSpeaking
                  ? 'SPEAKING'
                  : isListening
                  ? 'LISTENING'
                  : isLoading
                  ? 'THINKING'
                  : 'READY'}
              </span>
            </div>
          </div>

          {/* Candidate Bio & Voice Info */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-amber-400/90 text-xs font-semibold tracking-widest uppercase">
                  Executive Voice Dossier
                </span>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-stone-100 mt-0.5">
                  {INES_CV_DATA.personal.fullName}
                </h1>
              </div>

              {/* Share / Copy Action */}
              <button
                onClick={handleCopyLink}
                className="self-center md:self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 text-xs border border-stone-700/50 transition-colors"
                title="Copy assistant link"
              >
                {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedNotification ? 'Copied' : 'Share Dossier'}</span>
              </button>
            </div>

            <p className="text-sm md:text-base text-amber-100/80 font-light mt-1 max-w-xl">
              Conseillère Clientèle • Master Marketing du Luxe (ESCE Paris) • Galeries Lafayette Alum • Trilingual Talent
            </p>

            {/* Voice Status & Tone Selector */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 pt-4 border-t border-stone-800/80 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-amber-200/90 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Feminine Voice Persona: <strong>{selectedVoice === 'Kore' ? 'Kore (Warm & Articulate)' : 'Zephyr (Chic & Modern)'}</strong></span>
              </div>

              <div className="flex items-center gap-1">
                <span>Voice:</span>
                <button
                  onClick={() => onSelectVoice('Kore')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    selectedVoice === 'Kore'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Kore
                </button>
                <button
                  onClick={() => onSelectVoice('Zephyr')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    selectedVoice === 'Zephyr'
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Zephyr
                </button>
              </div>

              {activeSpeaking && (
                <button
                  onClick={onStopSpeaking}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 ml-auto px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/30"
                >
                  <Square className="w-3 h-3 fill-rose-400" />
                  <span>Stop Speech</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Visualizer Strip */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-col items-center">
          <AudioWaveform
            frequencies={frequencyData}
            isSpeaking={activeSpeaking}
            isListening={isListening}
            isLoading={isLoading}
          />

          <div className="text-center text-xs text-stone-400 mt-1">
            {activeSpeaking ? (
              <span className="text-amber-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                Inès is presenting in {selectedLanguage.toUpperCase()}
              </span>
            ) : isListening ? (
              <span className="text-rose-400 font-medium animate-pulse">
                Listening to your question... Speak clearly
              </span>
            ) : isLoading ? (
              <span className="text-stone-300 animate-pulse">
                Formulating executive response & generating voice audio...
              </span>
            ) : (
              <span className="text-stone-400">
                Click the microphone below to ask any interview question or choose a prompt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Multilingual Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          <span>Spoken Language:</span>
        </div>

        <LanguageSelector
          currentLanguage={selectedLanguage}
          onSelectLanguage={onSelectLanguage}
          onPlayGreeting={handlePlayGreeting}
          isSpeaking={activeSpeaking}
        />

        {/* Live Call Toggle */}
        {onStartLiveSession && onStopLiveSession && (
          <button
            onClick={() => {
              if (isLiveActive) {
                onStopLiveSession();
              } else {
                onStartLiveSession();
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isLiveActive
                ? 'bg-rose-600 text-white shadow-lg animate-pulse'
                : 'bg-stone-900 text-amber-200 hover:bg-stone-800 shadow-xs'
            }`}
            title="Real-time live voice duplex conversation with Gemini 3.8 Live"
          >
            {isLiveActive ? (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Live Call</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Call Mode</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Primary Voice Action Center: The Big Microphone */}
      <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/90 shadow-sm">
        <div className="relative">
          {/* Ripple rings */}
          {isListening && (
            <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
          )}
          {isLoading && (
            <div className="absolute -inset-4 rounded-full bg-amber-500/20 animate-spin pointer-events-none" />
          )}

          <button
            onClick={() => {
              if (isListening) {
                onStopListening();
              } else {
                onStartListening();
              }
            }}
            disabled={isLoading || isLiveActive}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 shadow-xl transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] scale-105'
                : isLoading
                ? 'bg-stone-800 text-amber-300 cursor-wait'
                : 'bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-950 text-amber-200 hover:shadow-2xl hover:scale-105 ring-4 ring-amber-400/20 hover:ring-amber-400/40'
            }`}
            aria-label="Toggle voice input"
          >
            {isListening ? (
              <>
                <MicOff className="w-8 h-8 animate-pulse text-white" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Tap to Stop</span>
              </>
            ) : isLoading ? (
              <>
                <Sparkles className="w-8 h-8 animate-spin text-amber-300" />
                <span className="text-[10px] uppercase tracking-wider">Thinking</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 text-amber-300" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        {/* Live speech interim transcript */}
        {currentTranscript && (
          <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 italic max-w-md text-center">
            "{currentTranscript}"
          </div>
        )}

        {/* Error notice if any */}
        {error && (
          <div className="mt-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 max-w-md text-center">
            {error}
          </div>
        )}

        {/* Quick Pitch Pill Buttons */}
        <div className="w-full mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Instant Recruiter Voice Triggers
            </span>
            <span className="text-[11px] text-amber-800 font-medium">Click to hear Inès answer</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {PRESET_QUESTIONS.slice(0, 6).map((q) => {
              const promptText = q.prompt[selectedLanguage] || q.prompt.en;
              return (
                <button
                  key={q.id}
                  onClick={() => onAskQuestion(promptText, selectedLanguage)}
                  disabled={isLoading || isListening}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50/90 hover:bg-amber-50/80 border border-stone-200/80 hover:border-amber-300 text-left transition-all text-xs group"
                >
                  <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 group-hover:bg-amber-200 transition-colors flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 group-hover:text-amber-950">
                      {q.label}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {promptText}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Conversation Transcript Drawer */}
      <div className="flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/60">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Interactive Voice Transcript
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            {messages.length} {messages.length === 1 ? 'exchange' : 'exchanges'}
          </span>
        </div>

        {/* Scrollable messages */}
        <div className="p-6 max-h-[380px] overflow-y-auto flex flex-col gap-4">
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isAsst ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {isAsst && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-amber-400/40">
                    <img
                      src={INES_CV_DATA.personal.portraitUrl}
                      alt="Inès"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div
                  className={`flex flex-col p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isAsst
                      ? 'bg-stone-50 border border-stone-200/90 text-stone-800 shadow-2xs'
                      : 'bg-stone-900 text-stone-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[11px] font-medium text-stone-400">
                    <span>{isAsst ? 'Inès Boutbig' : 'Recruiter / You'}</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap font-sans">{msg.content}</p>

                  {/* Audio Replay Button for Assistant Responses */}
                  {isAsst && (
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-stone-200/60">
                      <button
                        onClick={() => onReplayMessage(msg)}
                        disabled={activeSpeaking}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-medium py-1 px-2 rounded-md hover:bg-amber-100/60 transition-colors"
                        title="Listen to this answer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay Audio</span>
                      </button>

                      {msg.language && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-600">
                          {msg.language}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="self-start flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <span className="animate-pulse">Inès is preparing her answer...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Custom Question Input Form */}
        <form onSubmit={handleSendTyped} className="p-4 bg-stone-50 border-t border-stone-200 flex gap-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={`Ask Inès anything about her CV in ${selectedLanguage === 'fr' ? 'French' : selectedLanguage === 'ar' ? 'Arabic' : selectedLanguage === 'es' ? 'Spanish' : 'English'}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-xs md:text-sm text-stone-800"
          />
          <button
            type="submit"
            disabled={!typedInput.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs md:text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
