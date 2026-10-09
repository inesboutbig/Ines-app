class AudioPlayerService {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private isPlaying = false;
  private onEndCallback: (() => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onErrorCallback: ((err: any) => void) | null = null;
  private volume = 1.0;

  constructor() {
    // Audio elements will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initAudio() {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        if (this.onEndCallback) this.onEndCallback();
      });

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
        if (this.onStartCallback) this.onStartCallback();
      });

      this.audioElement.addEventListener('error', (e) => {
        this.isPlaying = false;
        if (this.onErrorCallback) this.onErrorCallback(e);
      });
    }

    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;

          if (this.audioElement) {
            this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
          }
        }
      } catch (e) {
        console.warn('Could not connect web audio analyser to HTML audio element:', e);
      }
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  public async playBase64(
    base64Data: string,
    mimeType = 'audio/wav',
    callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (e: any) => void }
  ): Promise<void> {
    this.stop();
    this.initAudio();

    if (callbacks?.onStart) this.onStartCallback = callbacks.onStart;
    if (callbacks?.onEnd) this.onEndCallback = callbacks.onEnd;
    if (callbacks?.onError) this.onErrorCallback = callbacks.onError;

    if (!this.audioElement) return;

    this.audioElement.src = `data:${mimeType};base64,${base64Data}`;
    this.audioElement.volume = this.volume;

    try {
      await this.audioElement.play();
    } catch (err) {
      console.warn('Audio play failed (user interaction required):', err);
      if (callbacks?.onError) callbacks.onError(err);
      throw err;
    }
  }

  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isPlaying = false;
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  public resume(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioPlayer = new AudioPlayerService();
