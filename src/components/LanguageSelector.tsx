import React from 'react';
import { Volume2 } from 'lucide-react';
import { Language } from '../types';
import { INES_CV_DATA } from '../data/cvData';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onPlayGreeting?: (lang: Language) => void;
  isSpeaking?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  onPlayGreeting,
  isSpeaking,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-stone-100/80 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs">
      {INES_CV_DATA.languages.map((lang) => {
        const isSelected = currentLanguage === lang.code;

        return (
          <div key={lang.code} className="flex items-center">
            <button
              onClick={() => onSelectLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                isSelected
                  ? 'bg-stone-900 text-amber-100 shadow-md ring-1 ring-amber-400/30'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
              title={`${lang.name} - ${lang.level}`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span className="capitalize">{lang.nativeName}</span>
              <span
                className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-200 text-stone-500'
                }`}
              >
                {lang.level.split('/')[0].trim()}
              </span>
            </button>

            {onPlayGreeting && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayGreeting(lang.code);
                }}
                disabled={isSpeaking}
                className="p-1.5 ml-0.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                title={`Listen to greeting in ${lang.name}`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
