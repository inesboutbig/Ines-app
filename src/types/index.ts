export type Language = 'en' | 'fr' | 'ar' | 'es';

export interface CVData {
  personal: {
    fullName: string;
    role: string;
    tagline: string;
    availability: string;
    email: string;
    phone: string;
    location: string;
    about: string;
    portraitUrl: string;
  };
  keyHighlights: {
    title: string;
    metric: string;
    description: string;
    icon: string;
  }[];
  experiences: {
    id: string;
    company: string;
    location: string;
    period: string;
    role: string;
    bullets: string[];
    tags: string[];
    luxuryRelevance: string;
  }[];
  education: {
    id: string;
    institution: string;
    location: string;
    period: string;
    degree: string;
    details: string;
    badge?: string;
  }[];
  languages: {
    code: Language;
    name: string;
    nativeName: string;
    level: string;
    flag: string;
    description: string;
    audioGreetingText: string;
  }[];
  skills: {
    category: string;
    items: { name: string; level: number; note: string }[];
  }[];
  qualities: {
    name: string;
    description: string;
    icon: string;
  }[];
  volunteerWork: {
    organization: string;
    location: string;
    role: string;
    description: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioBase64?: string;
  language?: Language;
  timestamp: number;
  audioDuration?: number;
}

export interface PresetQuestion {
  id: string;
  category: 'pitch' | 'luxury' | 'sales' | 'multilingual' | 'soft-skills';
  label: string;
  prompt: Record<Language, string>;
  icon: string;
}
