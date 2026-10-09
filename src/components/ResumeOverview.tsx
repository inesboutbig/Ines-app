import React, { useState } from 'react';
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Globe,
  Award,
  Sparkles,
  HeartHandshake,
  CheckCircle,
  Printer,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { INES_CV_DATA } from '../data/cvData';
import { Language } from '../types';

interface ResumeOverviewProps {
  onAskQuestion: (prompt: string, lang: Language) => void;
  selectedLanguage: Language;
}

export const ResumeOverview: React.FC<ResumeOverviewProps> = ({
  onAskQuestion,
  selectedLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'education' | 'skills'>('all');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 print:p-0">
      {/* Editorial Luxury Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-sm print:shadow-none print:border-none">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-amber-400/50 shadow-md flex-shrink-0">
              <img
                src={INES_CV_DATA.personal.portraitUrl}
                alt={INES_CV_DATA.personal.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
                Luxury Retail • Conseillère Clientèle
              </span>
              <h2 className="text-2xl md:text-4xl font-serif text-stone-900 mt-0.5">
                {INES_CV_DATA.personal.fullName}
              </h2>
              <p className="text-xs md:text-sm text-stone-600 font-medium mt-1">
                Étudiante en Master Marketing du Luxe à l'ESCE Paris • Recherche poste à temps partiel dès septembre
              </p>
            </div>
          </div>

          {/* Quick Actions (Call, Email, Print) */}
          <div className="flex flex-wrap gap-2 print:hidden">
            <a
              href={`mailto:${INES_CV_DATA.personal.email}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-amber-200 text-xs font-medium hover:bg-stone-800 transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Inès</span>
            </a>
            <a
              href={`tel:${INES_CV_DATA.personal.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-medium hover:bg-stone-200 transition-colors border border-stone-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>{INES_CV_DATA.personal.phone}</span>
            </a>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors border border-stone-200"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Executive Summary Statement */}
        <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-sans italic">
            "{INES_CV_DATA.personal.about}"
          </p>
        </div>

        {/* Key Metrics / Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {INES_CV_DATA.keyHighlights.map((hl, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                {hl.title}
              </span>
              <div className="text-sm font-semibold font-serif text-stone-900 mt-0.5">
                {hl.metric}
              </div>
              <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                {hl.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Experience Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-sm print:shadow-none print:border-none">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-6">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-800" />
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Expérience Professionnelle
            </h3>
          </div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
            PARCOURS
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {INES_CV_DATA.experiences.map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l-2 border-amber-300/60">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 ring-4 ring-amber-100" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {exp.company}
                  </h4>
                  <div className="text-xs font-semibold text-amber-900 mt-0.5">
                    {exp.role} • <span className="text-stone-500 font-normal">{exp.location}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  {exp.period}
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs md:text-sm text-stone-700">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Luxury relevance quote */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Impact Retail Luxe :</strong> {exp.luxuryRelevance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Formations Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-sm print:shadow-none print:border-none">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-800" />
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Formations & Échanges Internationaux
            </h3>
          </div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
            ACADÉMIQUE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INES_CV_DATA.education.map((edu) => (
            <div
              key={edu.id}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    {edu.badge || 'Degree'}
                  </span>
                  <span className="text-xs font-mono text-stone-500">{edu.period}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900 mt-2">
                  {edu.institution}
                </h4>
                <div className="text-xs text-stone-500 font-medium">{edu.location}</div>
                <div className="text-xs font-semibold text-stone-800 mt-2">{edu.degree}</div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{edu.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages & Multilingual Asset */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-sm print:shadow-none print:border-none">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-800" />
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Langues & Atout International
            </h3>
          </div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
            4 LANGUES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {INES_CV_DATA.languages.map((l) => (
            <div key={l.code} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-1">{l.flag}</div>
                <div className="font-serif font-bold text-stone-900 text-sm">{l.name}</div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mt-0.5">
                  {l.level}
                </div>
                <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                  {l.description}
                </p>
              </div>

              <button
                onClick={() => onAskQuestion(l.audioGreetingText, l.code)}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-stone-800 hover:text-amber-800 print:hidden"
              >
                <span>Écouter le pitch</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer & Extracurricular Leadership */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-sm print:shadow-none print:border-none">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-800" />
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Bénévolat & Leadership
            </h3>
          </div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
            ENGAGEMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INES_CV_DATA.volunteerWork.map((vol, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                {vol.role}
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-base mt-1">
                {vol.organization}
              </h4>
              <div className="text-xs text-stone-500 mb-2">{vol.location}</div>
              <p className="text-xs text-stone-600 leading-relaxed">{vol.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
