/** CodeQuest — efectos con Web Audio (sin archivos externos) */
const SoundFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type = 'sine', volume = 0.08, when = 0) {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + when);
    osc.stop(ac.currentTime + when + duration);
  }

  return {
    click() { tone(520, 0.06, 'sine', 0.06); },
    correct() {
      tone(523, 0.12, 'sine', 0.07, 0);
      tone(659, 0.14, 'sine', 0.07, 0.1);
      tone(784, 0.18, 'sine', 0.06, 0.2);
    },
    wrong() {
      tone(220, 0.2, 'triangle', 0.08, 0);
      tone(185, 0.25, 'triangle', 0.06, 0.12);
    },
    lifeline() { tone(523, 0.06, 'sine', 0.04); tone(659, 0.08, 'sine', 0.035, 0.07); },
    complete() {
      tone(523, 0.1, 'sine', 0.07, 0);
      tone(659, 0.1, 'sine', 0.07, 0.08);
      tone(784, 0.1, 'sine', 0.07, 0.16);
      tone(1047, 0.25, 'sine', 0.06, 0.24);
    },
    dailyDone() { tone(392, 0.15, 'sine', 0.06, 0); tone(523, 0.3, 'sine', 0.05, 0.12); }
  };
})();
