import React, { useState } from 'react';
import {
  Mic,
  FileText,
  UserCheck,
  Phone,
  Mail,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useLiveVoice } from './hooks/useLiveVoice';
import { VoiceAssistantPanel } from './components/VoiceAssistantPanel';
import { InterviewSimulator } from './components/InterviewSimulator';
import { ResumeOverview } from './components/ResumeOverview';
import { ContactModal } from './components/ContactModal';
import { INES_CV_DATA } from './data/cvData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'voice' | 'interview' | 'resume'>('voice');
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Standard Voice Assistant hook
  const {
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
  } = useVoiceAssistant();

  // Gemini 3.8 Live hook
  const {
    isActive: isLiveActive,
    status: liveStatus,
    isModelSpeaking: isLiveModelSpeaking,
    startLiveSession,
    stopLiveSession,
  } = useLiveVoice();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#1A1815]">
      {/* Top Luxury Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-amber-500/60 shadow-xs">
              <img
                src={INES_CV_DATA.personal.portraitUrl}
                alt={INES_CV_DATA.personal.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-stone-900 block leading-tight">
                INÈS BOUTBIG
              </span>
              <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-amber-800 font-semibold block">
                Luxury Client Advisor • Voice CV
              </span>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <nav className="hidden sm:flex items-center p-1 bg-stone-200/70 rounded-2xl border border-stone-300/60 shadow-2xs">
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'voice'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              <span>Voice Ambassador</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'interview'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Interview Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'resume'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Curriculum Vitae</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsContactOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Contact Inès</span>
              <span className="md:hidden">Contact</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex sm:hidden items-center justify-around mt-2.5 pt-2 border-t border-stone-200/80">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium ${
              activeTab === 'voice' ? 'text-amber-800 bg-amber-50 font-bold' : 'text-stone-600'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium ${
              activeTab === 'interview' ? 'text-amber-800 bg-amber-50 font-bold' : 'text-stone-600'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Interview</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium ${
              activeTab === 'resume' ? 'text-amber-800 bg-amber-50 font-bold' : 'text-stone-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
        {activeTab === 'voice' && (
          <VoiceAssistantPanel
            messages={messages}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            currentTranscript={currentTranscript}
            selectedLanguage={selectedLanguage}
            selectedVoice={selectedVoice}
            error={error}
            frequencyData={frequencyData}
            onSelectLanguage={setSelectedLanguage}
            onSelectVoice={setSelectedVoice}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={stopSpeaking}
            onAskQuestion={askQuestion}
            onReplayMessage={replayMessage}
            isLiveActive={isLiveActive}
            liveStatus={liveStatus}
            isLiveModelSpeaking={isLiveModelSpeaking}
            onStartLiveSession={startLiveSession}
            onStopLiveSession={stopLiveSession}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewSimulator
            currentLanguage={selectedLanguage}
            onAskQuestion={(prompt, lang) => {
              setActiveTab('voice');
              askQuestion(prompt, lang);
            }}
            isSpeaking={isSpeaking || isLiveModelSpeaking}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeOverview
            selectedLanguage={selectedLanguage}
            onAskQuestion={(prompt, lang) => {
              setActiveTab('voice');
              askQuestion(prompt, lang);
            }}
          />
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="mt-auto border-t border-stone-200/90 bg-white/60 py-6 px-4 md:px-8 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 tracking-wider">INÈS BOUTBIG</span>
            <span>•</span>
            <span>Conseillère Clientèle de Luxe</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <a href={`mailto:${INES_CV_DATA.personal.email}`} className="hover:text-amber-800 transition-colors">
              {INES_CV_DATA.personal.email}
            </a>
            <span>•</span>
            <a href={`tel:${INES_CV_DATA.personal.phone.replace(/\s+/g, '')}`} className="hover:text-amber-800 transition-colors">
              {INES_CV_DATA.personal.phone}
            </a>
          </div>
        </div>
      </footer>

      {/* Recruiter Contact Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
