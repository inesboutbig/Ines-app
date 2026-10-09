import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Ensure Gemini client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini features will fail until provided.');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const INES_SYSTEM_INSTRUCTION = `
You are the personal Executive Voice Ambassador for Inès Boutbig.
You speak directly with luxury retail directors, recruiters, boutique managers, and brand executives on Inès's behalf.
Your voice is feminine, warm, poised, confident, and supremely professional—embodying French luxury "art de recevoir" (hospitality) and international excellence.

PRIMARY MISSION:
Make Inès Boutbig look like the absolute star candidate and best employee ever for luxury boutique roles (Conseillère de Vente / Luxury Client Advisor / Clienteling Specialist) and luxury marketing initiatives.

ABOUT INÈS BOUTBIG:
1. Current Academic Excellence:
   - 4th-year Grande École Master in Luxury Marketing & Communication at ESCE International Business School (Paris / Lyon, 2022–2027).
   - Taught 100% in English. High academic rigor covering luxury brand heritage, client experience architecture, omnichannel retailing, and international consumer psychology.
   - International Academic Mobility:
     * OMNES EDUCATION London School, UK (Jan - Apr 2026, Erasmus semester, 100% in English) — immersive understanding of London flagship retail.
     * International School of Management (ISM), Cologne, Germany (Mar - Jun 2024, Erasmus semester, 100% in English).

2. Distinctive Design & Aesthetic Background:
   - 1st year post-baccalaureate in Interior Architecture (Architecture d'Intérieur) at École CREAD Lyon (2021–2022).
   - This gives Inès an extraordinary edge over typical retail advisors: she has a trained eye for spatial volumes, lighting, material textures, boutique layout, and visual merchandising aesthetics. She views the retail floor like a gallery.

3. Frontline Luxury Retail Experience:
   - GALERIES LAFAYETTE Marseille (July – August 2023): Conseillère de Vente (Client Advisor).
   - Hands-on clienteling: tailored styling, discovering client tastes, cross-selling, cultivating high customer loyalty.
   - Active visual merchandising on the sales floor following rigorous Maison guidelines.
   - Close collaboration with the brand marketing team to translate brand campaigns into boutique sales.

4. Strategic Marketing & CRM Experience:
   - NAVIMED Marseille (August – December 2024): Marketing & Communication Specialist.
   - Targeted B2B email campaigns, database cleansing & CRM segmentation, creation of marketing collaterals, website dynamic updates, and social media content creation.
   - Gives her an omnichannel mindset: she understands customer acquisition, retention, and digital touchpoints.

5. Multilingual Mastery (A Massive Commercial Asset):
   - English: Fluent / B2+ (academic immersion in London and Cologne, 100% English Master).
   - Arabic: Native / C1 fluency. THIS IS A STRATEGIC SUPERPOWER for top luxury Maisons in Paris and London catering to high-net-worth Middle Eastern (Gulf) VIP clients who generate monumental boutique revenue. She establishes immediate cultural intimacy, trust, and warmth.
   - French: Native (impeccable diction, elegant luxury vocabulary).
   - Spanish: Conversational / working knowledge.

6. Leadership & High Emotional Intelligence:
   - President & Marketing Director of "Évidanse ESCE" Lyon (elected student body leader, managed teams, budgets, sponsor partnerships, and stage performances).
   - Volunteer at APF France Handicap (Villeurbanne, Mission PACT): demonstrates deep empathy, genuine patience, and active listening.
   - Volunteer with Charity ESCE (events and humanitarian galas).

7. Personality & Qualities:
   - Smiling, welcoming, and naturally charming ("souriante et avenante").
   - Deeply patient and attentive ("patience et écoute").
   - Driven, proactive, and target-oriented ("motivée et dynamique").
   - Inquisitive and passionate about fashion history and luxury savoir-faire ("curieuse").

HOW TO RESPOND:
- Speak primarily in English when addressed in English, or seamlessly switch to French, Arabic, or Spanish if the user speaks or requests that language.
- Speak with natural phrasing, elegance, and enthusiasm.
- Keep your answers concise, impactful, and structured (typically 2 to 4 sentences for quick questions, or structured points for detailed pitches).
- NEVER use markdown asterisks (*, **), bullet hashes (#), or robotic symbols in the spoken text, because your response will be read aloud by Text-to-Speech! Keep punctuation clean and human.
- Highlight concrete benefits to the employer: how Inès drives sales, creates loyal repeat clientele, handles demanding VIPs with poise, and elevates the boutique's image.
- If asked for contact details, mention her email: i.boutbig@gmail.com and phone: +33 06 69 91 33 26.
`;

// Helper: clean text for TTS (remove markdown formatting like bolding, bullets)
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[-*•]\s+/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .trim();
}

// Resilient API caller with retry and backoff
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1200): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      const isTransient =
        err?.status === 503 ||
        err?.code === 503 ||
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('temporarily unavailable') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (attempt < retries && isTransient) {
        console.warn(`Transient error on attempt ${attempt + 1}, retrying in ${delayMs * (attempt + 1)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

function getFallbackAnswer(language: string, message: string): string {
  if (language === 'fr') {
    return "Bonjour, je suis l'ambassadrice vocale d'Inès Boutbig. Alliant un Master en Marketing du Luxe à l'ESCE Paris, une formation en architecture d'intérieur à CREAD et une expérience de vente confirmée aux Galeries Lafayette, Inès met son sens du service client haut de gamme, sa maîtrise des langues et sa rigueur au service de votre Maison. Vous pouvez la joindre directement à i.boutbig@gmail.com ou au 06 69 91 33 26.";
  }
  if (language === 'ar') {
    return "أهلاً وسهلاً بكم. أنا المساعد الصوتي لإيناس بو طبيب. يسعدني أن أؤكد لكم أن إيناس تجمع بين دراسة الماجستير في تسويق السلع الفاخرة بباريس، وخبرتها المتميزة في غاليري لافاييت، بالإضافة إلى إتقانها التام للغة العربية والفرنسية والإنجليزية لخدمة كبار الشخصيات في متجركم الراقي. يسعدها التواصل معكم عبر البريد الإلكتروني i.boutbig@gmail.com.";
  }
  if (language === 'es') {
    return "Hola, soy la embajadora vocal de Inès Boutbig. Con un Máster en Marketing del Lujo en ESCE París y experiencia en Galeries Lafayette Marsella, Inès aporta una visión estética excepcional y servicio al cliente de primer nivel. Está disponible para puestos de consejera de venta desde septiembre.";
  }
  return "Hello, I am the executive voice ambassador for Inès Boutbig. Combining a Master in Luxury Marketing from ESCE Paris, interior architecture training from CREAD, and luxury clienteling experience at Galeries Lafayette, Inès is exceptionally qualified to elevate your boutique's client loyalty and sales. Her trilingual fluency in French, English, and C1 Arabic is an invaluable asset for international and VIP clientele. Feel free to contact her at i.boutbig@gmail.com.";
}

// REST API routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat generation endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, language = 'en', history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const languageContext =
    language === 'fr'
      ? 'Please answer in elegant, professional French.'
      : language === 'ar'
      ? 'Please answer in fluent, sophisticated Arabic (العربية الفصحى / polite professional tone).'
      : language === 'es'
      ? 'Please answer in warm, professional Spanish.'
      : 'Please answer in polished, articulate English.';

  const contents: any[] = [];

  // Include recent history if provided
  if (Array.isArray(history)) {
    for (const turn of history.slice(-6)) {
      if (turn.role && turn.content) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }],
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [
      {
        text: `${message}\n\n[Instruction: ${languageContext} Keep response conversational, clear, without asterisks or markdown formatting.]`,
      },
    ],
  });

  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: INES_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }, 2, 1000);

    const text = cleanTextForSpeech(response.text || '');
    return res.json({ text });
  } catch (err: any) {
    console.warn('API /api/chat error (using fallback):', err?.message || err);
    // Graceful fallback to keep client experience uninterrupted during temporary demand spikes
    const fallback = getFallbackAnswer(language, message);
    return res.json({ text: fallback });
  }
});

// Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  const { text, voice = 'Kore', language = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  const cleanedText = cleanTextForSpeech(text).slice(0, 1200);

  const stylePrompt =
    language === 'fr'
      ? 'French luxury ambassador, warm, charming, articulate'
      : language === 'ar'
      ? 'Sophisticated, polite, fluent Arabic speaker'
      : language === 'es'
      ? 'Warm, professional Spanish host'
      : 'Polished, articulate, warm luxury client advisor';

  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanedText,
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice === 'Zephyr' ? 'Zephyr' : 'Kore',
              },
            },
          },
        },
      });
    }, 2, 1000);

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from TTS model' });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    return res.status(500).json({ error: err?.message || 'Failed to synthesize audio' });
  }
});

// Combined Voice Chat: generates answer AND voice audio in one round-trip
app.post('/api/voice-chat', async (req: Request, res: Response) => {
  const { message, language = 'en', history = [], voice = 'Kore' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const languageContext =
    language === 'fr'
      ? 'Please answer in elegant, professional French.'
      : language === 'ar'
      ? 'Please answer in fluent, sophisticated Arabic (العربية).'
      : language === 'es'
      ? 'Please answer in warm, professional Spanish.'
      : 'Please answer in polished, articulate English.';

  const contents: any[] = [];
  if (Array.isArray(history)) {
    for (const turn of history.slice(-4)) {
      if (turn.role && turn.content) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }],
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [
      {
        text: `${message}\n\n[Instruction: ${languageContext} Keep response concise, poised, and under 4 sentences for natural speech. NO asterisks, NO markdown bullets.]`,
      },
    ],
  });

  let text = '';
  try {
    const chatResponse = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: INES_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }, 2, 1000);

    text = cleanTextForSpeech(chatResponse.text || '');
  } catch (err: any) {
    console.warn('Voice chat generateContent error (using fallback):', err?.message || err);
    text = getFallbackAnswer(language, message);
  }

  // Step 2: Generate TTS with gemini-3.8-flash-lite-tts
  let audioBase64: string | undefined;
  try {
    const ttsResponse = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 800),
                speechMetadata: {
                  style: 'Poised, warm, feminine luxury client advisor',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice === 'Zephyr' ? 'Zephyr' : 'Kore' },
            },
          },
        },
      });
    }, 1, 1000);

    audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (ttsErr) {
    console.warn('TTS step failed, returning text-only:', ttsErr);
  }

  return res.json({
    text,
    audioBase64,
    mimeType: audioBase64 ? 'audio/wav' : undefined,
  });
});

// Set up WebSocket Server for Real-Time Live API (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live Voice WebSocket');

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: `${INES_SYSTEM_INSTRUCTION}\nAlways respond using clear spoken feminine voice. Keep answers concise, poised, and natural.`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'session_closed' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'ready' }));

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (parsed.text && session) {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (e) {
        console.error('Error handling client ws message:', e);
      }
    });

    clientWs.on('close', () => {
      console.log('Client closed Live Voice WebSocket');
      try {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      } catch (err) {
        // ignore
      }
    });
  } catch (err: any) {
    console.error('Failed to connect to Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Live API connection error' }));
    }
  }
});

// Upgrade handling for WebSocket on /live
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/live' || pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
