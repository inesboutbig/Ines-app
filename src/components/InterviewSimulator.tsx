import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  Clock,
  Compass,
  Award,
  ChevronRight,
  UserCheck,
  ShoppingBag,
  Globe,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { PRESET_QUESTIONS, INES_CV_DATA } from '../data/cvData';

interface InterviewSimulatorProps {
  currentLanguage: Language;
  onAskQuestion: (prompt: string, lang: Language) => void;
  isSpeaking: boolean;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({
  currentLanguage,
  onAskQuestion,
  isSpeaking,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: Award },
    { id: 'pitch', label: 'Elevator Pitches', icon: Clock },
    { id: 'luxury', label: 'Luxury & Design', icon: Sparkles },
    { id: 'sales', label: 'Boutique Sales', icon: ShoppingBag },
    { id: 'multilingual', label: 'Arabic & Languages', icon: Globe },
    { id: 'soft-skills', label: 'VIP Diplomacy', icon: ShieldCheck },
  ];

  const filteredQuestions =
    activeCategory === 'all'
      ? PRESET_QUESTIONS
      : PRESET_QUESTIONS.filter((q) => q.category === activeCategory);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-amber-800/40">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
          <UserCheck className="w-4 h-4" />
          <span>Executive Recruiter Mode</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif mt-1 text-stone-100">
          Interview Inès Boutbig
        </h2>
        <p className="text-sm text-amber-100/80 mt-1 max-w-2xl font-light">
          Simulate a real executive luxury retail interview. Click any question below to have Inès answer live in her feminine voice in {currentLanguage.toUpperCase()}.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => {
          const promptText = q.prompt[currentLanguage] || q.prompt.en;

          return (
            <div
              key={q.id}
              className="group bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    {q.category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {currentLanguage.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-950">
                  {q.label}
                </h3>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  "{promptText}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onAskQuestion(promptText, currentLanguage)}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-900 text-amber-200 hover:text-amber-100 text-xs font-medium transition-colors shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Listen to Inès</span>
                </button>

                <span className="text-[11px] text-stone-400 flex items-center gap-1 group-hover:text-amber-800 transition-colors">
                  <span>Simulate</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Strengths Checklist */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 mt-2">
        <h3 className="font-serif text-lg font-semibold text-amber-950 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          The Recruiter's Verdict: Why Inès is the Top Hire
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Master 1 Luxury Marketing:</strong> Taught 100% in English at ESCE Paris, with global exchanges in London and Germany.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Arabic C1 Strategic Power:</strong> Bridges cultural intimacy and drives massive spend with Middle Eastern VIP shoppers.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Interior Architecture Eye:</strong> Visual merchandising standards elevated through spatial proportion and design training.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Proven Retail Floor Mastery:</strong> Frontline clienteling experience at Galeries Lafayette Marseille.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
