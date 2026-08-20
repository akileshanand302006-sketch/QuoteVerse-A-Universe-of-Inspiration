/**
 * Web Speech API Utility for Read Aloud Mode
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
  }

  speak(text, onStart, onEnd, onError) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop(); // Cancel active speech

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.95; // Slightly slower for clear quote delivery
    this.utterance.pitch = 1;

    // Pick best English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }

    this.utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (onStart) onStart();
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (onEnd) onEnd();
    };

    this.utterance.onerror = (err) => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (onError) onError(err);
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }
}

export const speechService = new SpeechService();
