// server.ts
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var server = http.createServer(app);
var PORT = parseInt(process.env.PORT || "3000", 10);
app.use(express.json({ limit: "15mb" }));
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini features will fail until provided.");
}
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var INES_SYSTEM_INSTRUCTION = `
You are the personal Executive Voice Ambassador for In\xE8s Boutbig.
You speak directly with luxury retail directors, recruiters, boutique managers, and brand executives on In\xE8s's behalf.
Your voice is feminine, warm, poised, confident, and supremely professional\u2014embodying French luxury "art de recevoir" (hospitality) and international excellence.

PRIMARY MISSION:
Make In\xE8s Boutbig look like the absolute star candidate and best employee ever for luxury boutique roles (Conseill\xE8re de Vente / Luxury Client Advisor / Clienteling Specialist) and luxury marketing initiatives.

ABOUT IN\xC8S BOUTBIG:
1. Current Academic Excellence:
   - 4th-year Grande \xC9cole Master in Luxury Marketing & Communication at ESCE International Business School (Paris / Lyon, 2022\u20132027).
   - Taught 100% in English. High academic rigor covering luxury brand heritage, client experience architecture, omnichannel retailing, and international consumer psychology.
   - International Academic Mobility:
     * OMNES EDUCATION London School, UK (Jan - Apr 2026, Erasmus semester, 100% in English) \u2014 immersive understanding of London flagship retail.
     * International School of Management (ISM), Cologne, Germany (Mar - Jun 2024, Erasmus semester, 100% in English).

2. Distinctive Design & Aesthetic Background:
   - 1st year post-baccalaureate in Interior Architecture (Architecture d'Int\xE9rieur) at \xC9cole CREAD Lyon (2021\u20132022).
   - This gives In\xE8s an extraordinary edge over typical retail advisors: she has a trained eye for spatial volumes, lighting, material textures, boutique layout, and visual merchandising aesthetics. She views the retail floor like a gallery.

3. Frontline Luxury Retail Experience:
   - GALERIES LAFAYETTE Marseille (July \u2013 August 2023): Conseill\xE8re de Vente (Client Advisor).
   - Hands-on clienteling: tailored styling, discovering client tastes, cross-selling, cultivating high customer loyalty.
   - Active visual merchandising on the sales floor following rigorous Maison guidelines.
   - Close collaboration with the brand marketing team to translate brand campaigns into boutique sales.

4. Strategic Marketing & CRM Experience:
   - NAVIMED Marseille (August \u2013 December 2024): Marketing & Communication Specialist.
   - Targeted B2B email campaigns, database cleansing & CRM segmentation, creation of marketing collaterals, website dynamic updates, and social media content creation.
   - Gives her an omnichannel mindset: she understands customer acquisition, retention, and digital touchpoints.

5. Multilingual Mastery (A Massive Commercial Asset):
   - English: Fluent / B2+ (academic immersion in London and Cologne, 100% English Master).
   - Arabic: Native / C1 fluency. THIS IS A STRATEGIC SUPERPOWER for top luxury Maisons in Paris and London catering to high-net-worth Middle Eastern (Gulf) VIP clients who generate monumental boutique revenue. She establishes immediate cultural intimacy, trust, and warmth.
   - French: Native (impeccable diction, elegant luxury vocabulary).
   - Spanish: Conversational / working knowledge.

6. Leadership & High Emotional Intelligence:
   - President & Marketing Director of "\xC9vidanse ESCE" Lyon (elected student body leader, managed teams, budgets, sponsor partnerships, and stage performances).
   - Volunteer at APF France Handicap (Villeurbanne, Mission PACT): demonstrates deep empathy, genuine patience, and active listening.
   - Volunteer with Charity ESCE (events and humanitarian galas).

7. Personality & Qualities:
   - Smiling, welcoming, and naturally charming ("souriante et avenante").
   - Deeply patient and attentive ("patience et \xE9coute").
   - Driven, proactive, and target-oriented ("motiv\xE9e et dynamique").
   - Inquisitive and passionate about fashion history and luxury savoir-faire ("curieuse").

HOW TO RESPOND:
- Speak primarily in English when addressed in English, or seamlessly switch to French, Arabic, or Spanish if the user speaks or requests that language.
- Speak with natural phrasing, elegance, and enthusiasm.
- Keep your answers concise, impactful, and structured (typically 2 to 4 sentences for quick questions, or structured points for detailed pitches).
- NEVER use markdown asterisks (*, **), bullet hashes (#), or robotic symbols in the spoken text, because your response will be read aloud by Text-to-Speech! Keep punctuation clean and human.
- Highlight concrete benefits to the employer: how In\xE8s drives sales, creates loyal repeat clientele, handles demanding VIPs with poise, and elevates the boutique's image.
- If asked for contact details, mention her email: i.boutbig@gmail.com and phone: +33 06 69 91 33 26.
`;
function cleanTextForSpeech(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/#{1,6}\s+/g, "").replace(/[-*•]\s+/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/`{1,3}.*?`{1,3}/gs, "").trim();
}
async function callWithRetry(fn, retries = 2, delayMs = 1200) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const errMsg = err?.message || "";
      const isTransient = err?.status === 503 || err?.code === 503 || errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE") || errMsg.includes("temporarily unavailable") || errMsg.includes("RESOURCE_EXHAUSTED");
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
function getFallbackAnswer(language, message) {
  if (language === "fr") {
    return "Bonjour, je suis l'ambassadrice vocale d'In\xE8s Boutbig. Alliant un Master en Marketing du Luxe \xE0 l'ESCE Paris, une formation en architecture d'int\xE9rieur \xE0 CREAD et une exp\xE9rience de vente confirm\xE9e aux Galeries Lafayette, In\xE8s met son sens du service client haut de gamme, sa ma\xEEtrise des langues et sa rigueur au service de votre Maison. Vous pouvez la joindre directement \xE0 i.boutbig@gmail.com ou au 06 69 91 33 26.";
  }
  if (language === "ar") {
    return "\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u0628\u0643\u0645. \u0623\u0646\u0627 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0635\u0648\u062A\u064A \u0644\u0625\u064A\u0646\u0627\u0633 \u0628\u0648 \u0637\u0628\u064A\u0628. \u064A\u0633\u0639\u062F\u0646\u064A \u0623\u0646 \u0623\u0624\u0643\u062F \u0644\u0643\u0645 \u0623\u0646 \u0625\u064A\u0646\u0627\u0633 \u062A\u062C\u0645\u0639 \u0628\u064A\u0646 \u062F\u0631\u0627\u0633\u0629 \u0627\u0644\u0645\u0627\u062C\u0633\u062A\u064A\u0631 \u0641\u064A \u062A\u0633\u0648\u064A\u0642 \u0627\u0644\u0633\u0644\u0639 \u0627\u0644\u0641\u0627\u062E\u0631\u0629 \u0628\u0628\u0627\u0631\u064A\u0633\u060C \u0648\u062E\u0628\u0631\u062A\u0647\u0627 \u0627\u0644\u0645\u062A\u0645\u064A\u0632\u0629 \u0641\u064A \u063A\u0627\u0644\u064A\u0631\u064A \u0644\u0627\u0641\u0627\u064A\u064A\u062A\u060C \u0628\u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0625\u062A\u0642\u0627\u0646\u0647\u0627 \u0627\u0644\u062A\u0627\u0645 \u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629 \u0648\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0644\u062E\u062F\u0645\u0629 \u0643\u0628\u0627\u0631 \u0627\u0644\u0634\u062E\u0635\u064A\u0627\u062A \u0641\u064A \u0645\u062A\u062C\u0631\u0643\u0645 \u0627\u0644\u0631\u0627\u0642\u064A. \u064A\u0633\u0639\u062F\u0647\u0627 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643\u0645 \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A i.boutbig@gmail.com.";
  }
  if (language === "es") {
    return "Hola, soy la embajadora vocal de In\xE8s Boutbig. Con un M\xE1ster en Marketing del Lujo en ESCE Par\xEDs y experiencia en Galeries Lafayette Marsella, In\xE8s aporta una visi\xF3n est\xE9tica excepcional y servicio al cliente de primer nivel. Est\xE1 disponible para puestos de consejera de venta desde septiembre.";
  }
  return "Hello, I am the executive voice ambassador for In\xE8s Boutbig. Combining a Master in Luxury Marketing from ESCE Paris, interior architecture training from CREAD, and luxury clienteling experience at Galeries Lafayette, In\xE8s is exceptionally qualified to elevate your boutique's client loyalty and sales. Her trilingual fluency in French, English, and C1 Arabic is an invaluable asset for international and VIP clientele. Feel free to contact her at i.boutbig@gmail.com.";
}
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/chat", async (req, res) => {
  const { message, language = "en", history = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const languageContext = language === "fr" ? "Please answer in elegant, professional French." : language === "ar" ? "Please answer in fluent, sophisticated Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649 / polite professional tone)." : language === "es" ? "Please answer in warm, professional Spanish." : "Please answer in polished, articulate English.";
  const contents = [];
  if (Array.isArray(history)) {
    for (const turn of history.slice(-6)) {
      if (turn.role && turn.content) {
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }]
        });
      }
    }
  }
  contents.push({
    role: "user",
    parts: [
      {
        text: `${message}

[Instruction: ${languageContext} Keep response conversational, clear, without asterisks or markdown formatting.]`
      }
    ]
  });
  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: INES_SYSTEM_INSTRUCTION,
          temperature: 0.7
        }
      });
    }, 2, 1e3);
    const text = cleanTextForSpeech(response.text || "");
    return res.json({ text });
  } catch (err) {
    console.warn("API /api/chat error (using fallback):", err?.message || err);
    const fallback = getFallbackAnswer(language, message);
    return res.json({ text: fallback });
  }
});
app.post("/api/tts", async (req, res) => {
  const { text, voice = "Kore", language = "en" } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required for TTS" });
  }
  const cleanedText = cleanTextForSpeech(text).slice(0, 1200);
  const stylePrompt = language === "fr" ? "French luxury ambassador, warm, charming, articulate" : language === "ar" ? "Sophisticated, polite, fluent Arabic speaker" : language === "es" ? "Warm, professional Spanish host" : "Polished, articulate, warm luxury client advisor";
  try {
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: cleanedText,
                speechMetadata: {
                  style: stylePrompt
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice === "Zephyr" ? "Zephyr" : "Kore"
              }
            }
          }
        }
      });
    }, 2, 1e3);
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "No audio returned from TTS model" });
    }
    return res.json({
      audioBase64: base64Audio,
      mimeType: "audio/wav"
    });
  } catch (err) {
    console.error("Error in /api/tts:", err);
    return res.status(500).json({ error: err?.message || "Failed to synthesize audio" });
  }
});
app.post("/api/voice-chat", async (req, res) => {
  const { message, language = "en", history = [], voice = "Kore" } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const languageContext = language === "fr" ? "Please answer in elegant, professional French." : language === "ar" ? "Please answer in fluent, sophisticated Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629)." : language === "es" ? "Please answer in warm, professional Spanish." : "Please answer in polished, articulate English.";
  const contents = [];
  if (Array.isArray(history)) {
    for (const turn of history.slice(-4)) {
      if (turn.role && turn.content) {
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }]
        });
      }
    }
  }
  contents.push({
    role: "user",
    parts: [
      {
        text: `${message}

[Instruction: ${languageContext} Keep response concise, poised, and under 4 sentences for natural speech. NO asterisks, NO markdown bullets.]`
      }
    ]
  });
  let text = "";
  try {
    const chatResponse = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: INES_SYSTEM_INSTRUCTION,
          temperature: 0.7
        }
      });
    }, 2, 1e3);
    text = cleanTextForSpeech(chatResponse.text || "");
  } catch (err) {
    console.warn("Voice chat generateContent error (using fallback):", err?.message || err);
    text = getFallbackAnswer(language, message);
  }
  let audioBase64;
  try {
    const ttsResponse = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text.slice(0, 800),
                speechMetadata: {
                  style: "Poised, warm, feminine luxury client advisor"
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice === "Zephyr" ? "Zephyr" : "Kore" }
            }
          }
        }
      });
    }, 1, 1e3);
    audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (ttsErr) {
    console.warn("TTS step failed, returning text-only:", ttsErr);
  }
  return res.json({
    text,
    audioBase64,
    mimeType: audioBase64 ? "audio/wav" : void 0
  });
});
var wss = new WebSocketServer({ noServer: true });
wss.on("connection", async (clientWs) => {
  console.log("Client connected to Live Voice WebSocket");
  let session = null;
  try {
    session = await ai.live.connect({
      model: "gemini-3.8-live",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
        },
        systemInstruction: `${INES_SYSTEM_INSTRUCTION}
Always respond using clear spoken feminine voice. Keep answers concise, poised, and natural.`
      },
      callbacks: {
        onmessage: (message) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "audio", audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "interrupted" }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "session_closed" }));
          }
        }
      }
    });
    clientWs.send(JSON.stringify({ type: "ready" }));
    clientWs.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" }
          });
        } else if (parsed.text && session) {
          session.sendRealtimeInput({
            text: parsed.text
          });
        }
      } catch (e) {
        console.error("Error handling client ws message:", e);
      }
    });
    clientWs.on("close", () => {
      console.log("Client closed Live Voice WebSocket");
      try {
        if (session && typeof session.close === "function") {
          session.close();
        }
      } catch (err) {
      }
    });
  } catch (err) {
    console.error("Failed to connect to Gemini Live session:", err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: "error", message: err?.message || "Live API connection error" }));
    }
  }
});
server.on("upgrade", (request, socket, head) => {
  const { pathname } = new URL(request.url || "", `http://${request.headers.host}`);
  if (pathname === "/live" || pathname === "/api/live") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Server startup error:", err);
});
