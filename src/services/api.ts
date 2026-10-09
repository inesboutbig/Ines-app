import { Language, ChatMessage } from '../types';

export interface VoiceChatResponse {
  text: string;
  audioBase64?: string;
  mimeType?: string;
}

export async function sendVoiceChatMessage(
  message: string,
  language: Language = 'en',
  history: ChatMessage[] = [],
  voice: 'Kore' | 'Zephyr' = 'Kore'
): Promise<VoiceChatResponse> {
  const res = await fetch('/api/voice-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      voice,
      history: history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${res.status}`);
  }

  return res.json();
}

export async function sendChatMessage(
  message: string,
  language: Language = 'en',
  history: ChatMessage[] = []
): Promise<{ text: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      history: history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${res.status}`);
  }

  return res.json();
}

export async function synthesizeSpeech(
  text: string,
  voice: 'Kore' | 'Zephyr' = 'Kore',
  language: Language = 'en'
): Promise<{ audioBase64: string; mimeType: string }> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice,
      language,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `TTS synthesis failed: ${res.status}`);
  }

  return res.json();
}
