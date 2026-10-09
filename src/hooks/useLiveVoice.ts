import { useState, useRef, useCallback, useEffect } from 'react';

// Helper: convert Float32 [-1, 1] audio buffer to base64 raw 16-bit PCM (little-endian)
function floatTo16BitPCMBase64(input: Float32Array): string {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function useLiveVoice() {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const playAudioChunk = useCallback((base64Data: string) => {
    if (!outputAudioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
      }

      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += audioBuffer.duration;
      setIsModelSpeaking(true);

      source.onended = () => {
        if (ctx.currentTime >= nextPlayTimeRef.current - 0.05) {
          setIsModelSpeaking(false);
        }
      };
    } catch (e) {
      console.warn('Live audio chunk decode error:', e);
    }
  }, []);

  const stopLiveSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    setIsActive(false);
    setStatus('idle');
    setIsModelSpeaking(false);
  }, []);

  const startLiveSession = useCallback(async () => {
    setError(null);
    setStatus('connecting');

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('connected');
        setIsActive(true);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const inputCtx = new AudioCtx({ sampleRate: 16000 });
          inputAudioCtxRef.current = inputCtx;

          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          source.connect(processor);
          processor.connect(inputCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const pcmData = e.inputBuffer.getChannelData(0);
              const base64 = floatTo16BitPCMBase64(pcmData);
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };
        } catch (micErr: any) {
          console.error('Microphone access denied:', micErr);
          setError('Microphone access denied. Please allow microphone permissions.');
          stopLiveSession();
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'audio' && msg.audio) {
            playAudioChunk(msg.audio);
          } else if (msg.type === 'interrupted') {
            nextPlayTimeRef.current = 0;
            setIsModelSpeaking(false);
          } else if (msg.type === 'error') {
            setError(msg.message || 'Live session error');
          }
        } catch (e) {
          console.warn('Error parsing Live WS message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setError('Live connection failed. You can use standard Voice Chat mode.');
        setStatus('error');
        stopLiveSession();
      };

      ws.onclose = () => {
        stopLiveSession();
      };
    } catch (err: any) {
      console.error('Could not initiate Live API session:', err);
      setError(err?.message || 'Failed to start Live session');
      setStatus('error');
      stopLiveSession();
    }
  }, [playAudioChunk, stopLiveSession]);

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, [stopLiveSession]);

  return {
    isActive,
    status,
    isModelSpeaking,
    error,
    startLiveSession,
    stopLiveSession,
  };
}
