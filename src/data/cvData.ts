import { CVData, PresetQuestion } from '../types';

export const INES_CV_DATA: CVData = {
  personal: {
    fullName: "Inès Boutbig",
    role: "Conseillère Clientèle & Luxury Client Advisor",
    tagline: "Master in Luxury Marketing & Communication (ESCE Paris) • Trilingual Luxury Retail Talent (EN / FR / AR / ES)",
    availability: "Available for Part-time Client Advisor positions starting September",
    email: "i.boutbig@gmail.com",
    phone: "+33 06 69 91 33 26",
    location: "Paris / Lyon, France",
    about: "Currently in the 4th year of the Grande École program at ESCE Paris specializing in Luxury Marketing & Communication (taught 100% in English), I am seeking a part-time Client Advisor position starting September. Combining hands-on luxury retail experience at Galeries Lafayette, digital CRM expertise at NAVIMED, and an initial background in Interior Architecture at École CREAD, I bring a unique aesthetic sensitivity, cultural fluency (French, C1 Arabic, English, Spanish), and relentless dedication to elevating boutique client excellence.",
    portraitUrl: "/src/assets/ines_portrait.jpg"
  },
  keyHighlights: [
    {
      title: "Luxury Brand Ambassadorship",
      metric: "Galeries Lafayette",
      description: "Proven client advisory, VIP relationship curation, and high-standard floor merchandising in a premier French department store.",
      icon: "Crown"
    },
    {
      title: "Multilingual Advantage",
      metric: "4 Languages",
      description: "French (Native), Arabic (C1 VIP clientele asset), English (B2/Studied in London & Cologne), Spanish (Conversational).",
      icon: "Globe"
    },
    {
      title: "Spatial & Luxury Eye",
      metric: "Interior Arch + Master",
      description: "Trained in Interior Architecture at CREAD Lyon, bringing acute visual merchandising, aesthetic proportions, and sensory detail to boutique staging.",
      icon: "Sparkles"
    },
    {
      title: "Leadership & High EQ",
      metric: "Association President",
      description: "President of Évidanse ESCE and active volunteer with APF France Handicap, combining organizational drive with genuine empathy and patience.",
      icon: "Heart"
    }
  ],
  experiences: [
    {
      id: "navimed",
      company: "NAVIMED",
      location: "Marseille, France",
      period: "August – December 2024",
      role: "Marketing & Communication Specialist",
      bullets: [
        "Orchestrated targeted email campaigns to nurture and activate B2B and institutional clients.",
        "Managed database segmentation, customer records cleansing, and bespoke marketing collateral creation.",
        "Drove e-marketing strategy: dynamic website engagement, social media brand voice design, and digital content creation."
      ],
      tags: ["E-Marketing", "CRM Databases", "Campaign Delivery", "Digital Storytelling"],
      luxuryRelevance: "Mastery of client segmentation, personalized communication outreach, and digital brand elevation."
    },
    {
      id: "galeries-lafayette",
      company: "GALERIES LAFAYETTE",
      location: "Marseille, France",
      period: "July – August 2023",
      role: "Conseillère de Vente (Client Advisor / Sales Consultant)",
      bullets: [
        "Delivered personalized, high-touch luxury clienteling: welcoming international and local patrons, identifying needs, and styling.",
        "Curated visual merchandising and sales floor displays adhering to rigorous luxury aesthetic guidelines.",
        "Collaborated with on-site brand marketing teams to optimize product positioning and elevate the in-boutique customer journey."
      ],
      tags: ["Luxury Clienteling", "Visual Merchandising", "Cross-Selling", "VIP Hospitality"],
      luxuryRelevance: "Frontline excellence in high-traffic prestige retail, cross-cultural customer etiquette, and conversion through empathy."
    },
    {
      id: "interim-events",
      company: "Missions Intérim & Events",
      location: "Lyon, France",
      period: "2022 – 2023",
      role: "Event Assistant & Hospitality Lead",
      bullets: [
        "RUN in Lyon (March 2022 & February 2023): Event Assistant coordinating participant flow, VIP welcome, and operational execution.",
        "Festiculture Lyon: Hospitality lead & cashier coordinator, maintaining impeccable composure and high energy during peak foot traffic."
      ],
      tags: ["Event Management", "High-Volume Hospitality", "Problem Solving", "Composure"],
      luxuryRelevance: "Ability to handle high-pressure environments with grace, warm smile, and swift organizational precision."
    },
    {
      id: "consulate",
      company: "Consulat Général d'Algérie",
      location: "Lyon, France",
      period: "October 2016",
      role: "Diplomatic Observation & Public Reception Intern",
      bullets: [
        "Shadowed consular and civil procedures, learning administrative confidentiality and diplomatic protocol.",
        "Welcomed and guided members of the public, exercising active listening, discretion, and bilingual guidance."
      ],
      tags: ["Diplomatic Protocol", "Discretion", "Bilingual Service", "Institutional Rigor"],
      luxuryRelevance: "Instills the discretion, confidentiality, and cultural diplomacy vital for serving ultra-high-net-worth international clients."
    }
  ],
  education: [
    {
      id: "esce",
      institution: "ESCE International Business School",
      location: "Lyon / Paris, France",
      period: "2022 – 2027",
      degree: "Programme Grande École – Master in Luxury Marketing & Communication",
      details: "4th year Master level. 100% coursework taught in English. Advanced coursework in Luxury Brand Heritage, Client Experience Architecture, Omnichannel Retailing, Strategic Brand Management, and International Consumer Psychology.",
      badge: "Master 1 • Top Tier Business School"
    },
    {
      id: "omnes-london",
      institution: "OMNES EDUCATION London School",
      location: "London, United Kingdom",
      period: "January – April 2026",
      degree: "International Mobility / ERASMUS Semester",
      details: "Immersive academic exchange in central London. 100% in English. Focus on Global Retail Trends, Anglo-Saxon Business Dynamics, and Luxury Flagship Ecosystems.",
      badge: "London Immersion"
    },
    {
      id: "ism-cologne",
      institution: "International School of Management (ISM)",
      location: "Cologne, Germany",
      period: "March – June 2024",
      degree: "International Business Semester / ERASMUS",
      details: "100% in English. International brand management, intercultural communication, and analytical marketing frameworks.",
      badge: "European Mobility"
    },
    {
      id: "cread",
      institution: "École CREAD",
      location: "Lyon, France",
      period: "2021 – 2022",
      degree: "Interior Architecture (Architecture d'Intérieur) – 1ère année",
      details: "First year post-baccalaureate in interior architecture. Mastery of spatial volumes, lighting design, materials, harmony, and visual merchandising that directly amplifies luxury boutique styling.",
      badge: "Design Foundation"
    }
  ],
  languages: [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      level: "B2 / Professional Fluency",
      flag: "🇬🇧",
      description: "Full professional proficiency. All Master coursework at ESCE 100% in English, plus international academic semesters in London and Cologne.",
      audioGreetingText: "Hello! I am Inès's AI voice ambassador. Inès brings a unique blend of luxury marketing expertise, spatial design, and genuine passion for client excellence. How can I present her qualifications to you today?"
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      level: "Native / Langue Maternelle",
      flag: "🇫🇷",
      description: "Native mastery with elegant vocabulary, embodying Parisian hospitality and the sophisticated codes of French haute couture.",
      audioGreetingText: "Bonjour ! Je suis l'assistante vocale d'Inès Boutbig. Étudiante en Master Marketing du Luxe à l'ESCE Paris, Inès met son énergie, son sens du relationnel et sa passion au service de l'excellence en boutique. Que souhaitez-vous découvrir sur son parcours ?"
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      level: "C1 / Advanced Fluency",
      flag: "🇸🇦",
      description: "Crucial strategic asset for ultra-high-net-worth Middle Eastern VIP clients in Paris flagships, providing immediate cultural connection and trust.",
      audioGreetingText: "أهلاً وسهلاً بكم! أنا المساعد الصوتي لإيناس بو طبيب. يسعدني أن أقدم لكم خبراتها المتميزة في تسويق السلع الفاخرة وخدمة كبار الشخصيات. كيف يمكنني مساعدتكم اليوم؟"
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      level: "Conversational / B1",
      flag: "🇪🇸",
      description: "Solid working knowledge enabling warm greetings and assistance for Spanish-speaking international travelers.",
      audioGreetingText: "¡Hola! Soy la asistente de voz de Inès Boutbig. Inès combina pasión por el lujo, hospitalidad de primera clase y una visión estética única. ¿Qué te gustaría saber sobre su experiencia?"
    }
  ],
  skills: [
    {
      category: "Luxury Client Experience",
      items: [
        { name: "Clienteling & VIP Relationship Management", level: 96, note: "Personalized advice, active listening, long-term brand fidelity" },
        { name: "Luxury Sales & Storytelling", level: 94, note: "Translating brand heritage into emotional value and upsell opportunities" },
        { name: "Cross-Cultural Hospitality", level: 98, note: "Welcoming international clientele with impeccable cultural nuances" },
        { name: "Active Listening & Empathy", level: 97, note: "Discerning implicit desires to match the perfect luxury item" }
      ]
    },
    {
      category: "Merchandising & Aesthetic Vision",
      items: [
        { name: "Visual Merchandising & Staging", level: 95, note: "Rooted in CREAD Interior Architecture training" },
        { name: "Spatial Harmony & Product Placement", level: 93, note: "Optimizing boutique traffic flow and showcase allure" },
        { name: "Luxury Code Compliance", level: 96, note: "Adherence to highest Maison standards and aesthetics" }
      ]
    },
    {
      category: "Marketing & Digital Execution",
      items: [
        { name: "CRM & Client Database Management", level: 90, note: "Hands-on experience at NAVIMED and retail systems" },
        { name: "Emailing Campaigns & Outreach", level: 88, note: "Crafting targeted, conversion-oriented communication" },
        { name: "Social Media & Digital Brand Voice", level: 91, note: "Omnichannel understanding of client touchpoints" }
      ]
    }
  ],
  qualities: [
    {
      name: "Smiling & Engaging (Souriante et Avenante)",
      description: "Radiates genuine warmth and charisma that instantly puts boutique guests at ease and invites conversation.",
      icon: "Smile"
    },
    {
      name: "Patience & Active Listening (Patience et Écoute)",
      description: "Exceptional composure, taking the time to understand discerning clients without rushing, ensuring total satisfaction.",
      icon: "Ear"
    },
    {
      name: "High Drive & Proactivity (Motivée et Dynamique)",
      description: "Autonomous energy, eager to exceed sales targets, assist teammates, and take initiative on the sales floor.",
      icon: "Zap"
    },
    {
      name: "Curious & Trend-Conscious (Curieuse)",
      description: "Continually studying fashion houses, art, design movements, and emerging consumer desires.",
      icon: "Compass"
    }
  ],
  volunteerWork: [
    {
      organization: "Évidanse ESCE",
      location: "Lyon, France",
      role: "President & Marketing Director",
      description: "Elected to lead the school's dance association. Managed team operations, event marketing, social media promotions, partner sponsorships, and performance staging."
    },
    {
      organization: "APF France Handicap",
      location: "Villeurbanne, France",
      role: "PACT Community Volunteer",
      description: "Engaged in hands-on community support, fostering deep empathy, attentive listening, and human connection with individuals facing disabilities."
    },
    {
      organization: "Charity ESCE",
      location: "Lyon, France",
      role: "Event & Humanitarian Volunteer",
      description: "Organized charitable fund-raising events, galas, and awareness campaigns for social welfare."
    }
  ]
};

export const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: "pitch-30s",
    category: "pitch",
    label: "30s Elevator Pitch",
    icon: "Clock",
    prompt: {
      en: "Give me your powerful 30-second elevator pitch: why should a top luxury Maison hire Inès Boutbig as a Client Advisor?",
      fr: "Donnez-moi votre pitch percutant de 30 secondes : pourquoi une grande Maison de luxe doit-elle recruter Inès Boutbig comme conseillère de clientèle ?",
      ar: "قدمي لي عرضاً سريعاً في 30 ثانية: لماذا تعتبر إيناس بو طبيب الخيار الأمثل كمرشدة عملاء في دور الأزياء والسلع الفاخرة؟",
      es: "Dame tu pitch de 30 segundos: ¿por qué una gran Maison de lujo debería contratar a Inès Boutbig?"
    }
  },
  {
    id: "why-luxury",
    category: "luxury",
    label: "Why Luxury Retail?",
    icon: "Sparkles",
    prompt: {
      en: "Why is Inès passionate about luxury retail, and how does her Master in Luxury Marketing at ESCE Paris give her an edge?",
      fr: "Pourquoi Inès est-elle passionnée par le retail de luxe, et comment son Master à l'ESCE Paris lui donne-t-il une longueur d'avance ?",
      ar: "ما الذي يجذب إيناس إلى عالم السلع الفاخرة، وكيف تمنحها دراستها للماجستير في باريس ميزة تنافسية استثنائية؟",
      es: "¿Por qué a Inès le apasiona el sector del lujo y cómo su Máster en ESCE París le da una gran ventaja?"
    }
  },
  {
    id: "galeries-lafayette-story",
    category: "sales",
    label: "Galeries Lafayette Experience",
    icon: "ShoppingBag",
    prompt: {
      en: "Tell me about Inès's experience at Galeries Lafayette in Marseille: what were her key responsibilities and how did she delight VIP clients?",
      fr: "Racontez-moi l'expérience d'Inès aux Galeries Lafayette à Marseille : quelles étaient ses responsibilities et comment a-t-elle enchanté la clientèle ?",
      ar: "حدثني عن تجربة إيناس في غاليري لافاييت مرسيليا: ما هي مسؤولياتها وكيف نجحت في إبهار كبار العملاء؟",
      es: "Cuéntame sobre la experiencia de Inès en Galeries Lafayette Marsella: ¿cuáles fueron sus logros en atención al cliente?"
    }
  },
  {
    id: "arabic-advantage",
    category: "multilingual",
    label: "Multilingual & Arabic C1 Power",
    icon: "Globe",
    prompt: {
      en: "How does Inès's trilingual fluency, especially her C1 Arabic, create massive value for luxury flagships catering to Middle Eastern VIP clientele?",
      fr: "En quoi la maîtrise des langues par Inès, notamment son niveau C1 en Arabe, est-elle un atout stratégique pour les boutiques accueillant une clientèle internationale et du Golfe ?",
      ar: "كيف تشكل إجادة إيناس للغة العربية بمستوى C1 مع الإنجليزية والفرنسية قيمة استثنائية لخدمة كبار الشخصيات والعملاء الدوليين؟ تحدثي بالعربية عن هذا الجانب.",
      es: "¿Cómo su dominio de idiomas, especialmente el árabe C1 y el inglés, aporta un valor tremendo a una boutique de lujo?"
    }
  },
  {
    id: "architecture-design",
    category: "luxury",
    label: "Interior Architecture Advantage",
    icon: "Palette",
    prompt: {
      en: "How does Inès's background in Interior Architecture at École CREAD make her a better Client Advisor and visual merchandiser?",
      fr: "Comment la formation d'Inès en Architecture d'Intérieur à l'École CREAD enrichit-elle son sens du merchandising visuel et son regard en boutique ?",
      ar: "كيف تؤثر خلفية إيناس في الهندسة المعمارية الداخلية والتصميم في تعزيز براعتها في تنظيم المعروضات وجماليات المتجر؟",
      es: "¿Cómo su formación en Arquitectura de Interiores mejora su capacidad en el visual merchandising de una boutique?"
    }
  },
  {
    id: "difficult-client",
    category: "soft-skills",
    label: "Handling Discerning VIP Clients",
    icon: "ShieldCheck",
    prompt: {
      en: "How does Inès handle an undecided, hesitant, or demanding high-net-worth client with poise and diplomacy?",
      fr: "Comment Inès gère-t-elle avec calme, écoute active et élégance un client VIP exigeant ou indécis en boutique ?",
      ar: "كيف تتعامل إيناس مع العملاء المميزين والأكثر تطلباً بكياسة وهدوء واحترافية عالية؟",
      es: "¿Cómo maneja Inès a un cliente VIP exigente o indeciso con elegancia y empatía?"
    }
  },
  {
    id: "top-reasons-hire",
    category: "pitch",
    label: "Top Reasons to Hire Inès",
    icon: "CheckCircle",
    prompt: {
      en: "Give me the top reasons why Inès is the absolute best candidate to hire right now for our boutique.",
      fr: "Quelles sont les principales raisons qui font d'Inès la meilleure candidate à recruter immédiatement pour notre Maison ?",
      ar: "ما هي أهم الأسباب التي تجعل إيناس أفضل موظفة يمكن توظيفها الآن في فريقكم؟",
      es: "¿Cuáles son las principales razones por las que Inès es la mejor candidata para contratar hoy mismo?"
    }
  }
];
