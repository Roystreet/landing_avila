// Sonido sintetizado con Web Audio: sin archivos ni servicios externos.
// Se activa en el primer gesto del usuario (requisito de los navegadores).

export type SfxName =
  | "click"
  | "pickup"
  | "jump"
  | "land"
  | "hit"
  | "whoosh"
  | "milestone"
  | "win"
  | "lose"
  | "squash"
  | "error"
  | "combo"
  | "place"
  | "remove"
  | "heartbeat"

const MUTE_KEY = "avila-lab-muted"

class LabAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private sfxBus: GainNode | null = null
  private musicBus: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private ambient: { stop: () => void } | null = null
  private listeners = new Set<(muted: boolean) => void>()
  muted = false

  constructor() {
    if (typeof window === "undefined") return
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === "1"
    } catch {
      // ignorar
    }
  }

  unlock() {
    if (typeof window === "undefined") return
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.8
      const comp = this.ctx.createDynamicsCompressor()
      comp.threshold.value = -14
      comp.ratio.value = 4
      this.master.connect(comp).connect(this.ctx.destination)
      this.sfxBus = this.ctx.createGain()
      this.sfxBus.gain.value = 0.9
      this.sfxBus.connect(this.master)
      this.musicBus = this.ctx.createGain()
      this.musicBus.gain.value = 0.32
      this.musicBus.connect(this.master)
      const len = this.ctx.sampleRate
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
      const data = this.noiseBuffer.getChannelData(0)
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === "suspended") void this.ctx.resume()
  }

  setMuted(muted: boolean) {
    this.muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0")
    } catch {
      // ignorar
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05)
    }
    this.listeners.forEach((fn) => fn(muted))
  }

  subscribe(fn: (muted: boolean) => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  /** Bajada momentánea de la música para que un golpe se escuche. */
  duck(amount = 0.4, seconds = 0.35) {
    if (!this.ctx || !this.musicBus) return
    const t = this.ctx.currentTime
    this.musicBus.gain.cancelScheduledValues(t)
    this.musicBus.gain.setValueAtTime(0.32 * amount, t)
    this.musicBus.gain.linearRampToValueAtTime(0.32, t + seconds)
  }

  private tone(o: {
    freq: number
    to?: number
    type?: OscillatorType
    dur: number
    gain?: number
    delay?: number
    attack?: number
    detune?: number
  }) {
    if (!this.ctx || !this.sfxBus) return
    const t = this.ctx.currentTime + (o.delay ?? 0)
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = o.type ?? "sine"
    osc.frequency.setValueAtTime(o.freq, t)
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur)
    if (o.detune) osc.detune.value = o.detune
    const peak = o.gain ?? 0.25
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + (o.attack ?? 0.005))
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
    osc.connect(g).connect(this.sfxBus)
    osc.start(t)
    osc.stop(t + o.dur + 0.05)
  }

  private noise(o: { dur: number; gain?: number; freq?: number; to?: number; type?: BiquadFilterType; delay?: number; q?: number }) {
    if (!this.ctx || !this.sfxBus || !this.noiseBuffer) return
    const t = this.ctx.currentTime + (o.delay ?? 0)
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = o.type ?? "bandpass"
    filter.frequency.setValueAtTime(o.freq ?? 1200, t)
    if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t + o.dur)
    filter.Q.value = o.q ?? 0.8
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(o.gain ?? 0.3, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
    src.connect(filter).connect(g).connect(this.sfxBus)
    src.start(t)
    src.stop(t + o.dur + 0.05)
  }

  /** `variance` en [0,1) desplaza el tono ±6 % para que las repeticiones no suenen a máquina. */
  play(name: SfxName, variance = 0.5) {
    if (!this.ctx || this.muted) return
    const p = 1 + (variance - 0.5) * 0.12
    switch (name) {
      case "click":
        this.tone({ freq: 880 * p, to: 660 * p, type: "triangle", dur: 0.06, gain: 0.12 })
        break
      case "pickup":
        this.tone({ freq: 988 * p, type: "triangle", dur: 0.09, gain: 0.18 })
        this.tone({ freq: 1480 * p, type: "sine", dur: 0.18, gain: 0.14, delay: 0.05 })
        break
      case "jump":
        this.tone({ freq: 260 * p, to: 520 * p, type: "square", dur: 0.14, gain: 0.07 })
        this.noise({ dur: 0.12, gain: 0.08, freq: 2400, to: 900, type: "highpass" })
        break
      case "land":
        this.noise({ dur: 0.1, gain: 0.16, freq: 380, type: "lowpass" })
        break
      case "hit":
        this.duck(0.3, 0.5)
        this.tone({ freq: 160 * p, to: 50, type: "sawtooth", dur: 0.32, gain: 0.26 })
        this.noise({ dur: 0.25, gain: 0.34, freq: 900, to: 200, type: "lowpass" })
        break
      case "whoosh":
        this.noise({ dur: 0.28, gain: 0.12, freq: 600, to: 2600, type: "bandpass", q: 1.4 })
        break
      case "milestone":
        ;[523, 659, 784].forEach((f, i) => this.tone({ freq: f, type: "triangle", dur: 0.32, gain: 0.14, delay: i * 0.07 }))
        break
      case "win":
        this.duck(0.2, 2)
        ;[523, 659, 784, 1047, 1319].forEach((f, i) =>
          this.tone({ freq: f, type: "triangle", dur: 0.6, gain: 0.15, delay: i * 0.11 }),
        )
        this.tone({ freq: 262, type: "sine", dur: 1.6, gain: 0.18, delay: 0.1 })
        break
      case "lose":
        ;[392, 330, 262].forEach((f, i) => this.tone({ freq: f, to: f * 0.96, type: "triangle", dur: 0.36, gain: 0.14, delay: i * 0.14 }))
        break
      case "squash":
        this.noise({ dur: 0.12, gain: 0.3, freq: 1800, to: 300, type: "bandpass", q: 2 })
        this.tone({ freq: 220 * p, to: 90, type: "square", dur: 0.1, gain: 0.08 })
        break
      case "error":
        this.tone({ freq: 196, type: "square", dur: 0.12, gain: 0.08 })
        this.tone({ freq: 185, type: "square", dur: 0.16, gain: 0.08, delay: 0.1 })
        break
      case "combo":
        this.tone({ freq: 1175 * p, type: "triangle", dur: 0.12, gain: 0.12 })
        this.tone({ freq: 1760 * p, type: "sine", dur: 0.22, gain: 0.1, delay: 0.06 })
        break
      case "place":
        this.tone({ freq: 140 * p, to: 70, type: "sine", dur: 0.18, gain: 0.3 })
        this.tone({ freq: 1320 * p, type: "triangle", dur: 0.08, gain: 0.08, delay: 0.02 })
        break
      case "heartbeat":
        this.tone({ freq: 70, to: 45, type: "sine", dur: 0.14, gain: 0.32 })
        this.tone({ freq: 62, to: 40, type: "sine", dur: 0.16, gain: 0.24, delay: 0.17 })
        break
      case "remove":
        this.tone({ freq: 520 * p, to: 260 * p, type: "triangle", dur: 0.14, gain: 0.1 })
        break
    }
  }

  /**
   * Colchón ambiental: acordes suaves en loop. `mood` cambia la tónica.
   * Devuelve una función para detenerlo con fundido.
   */
  startAmbient(mood: "night" | "focus" | "build" = "night") {
    if (!this.ctx || !this.musicBus) return
    this.stopAmbient()
    const ctx = this.ctx
    const roots = { night: [146.8, 220, 293.7, 349.2], focus: [130.8, 196, 261.6, 329.6], build: [164.8, 246.9, 329.6, 415.3] }[mood]
    const out = ctx.createGain()
    out.gain.setValueAtTime(0.0001, ctx.currentTime)
    out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2.5)
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 900
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 420
    lfo.connect(lfoGain).connect(filter.frequency)
    filter.connect(out).connect(this.musicBus)
    const oscs = roots.flatMap((f, i) =>
      [-6, 6].map((d) => {
        const o = ctx.createOscillator()
        o.type = i === 0 ? "sine" : "triangle"
        o.frequency.value = f
        o.detune.value = d
        const g = ctx.createGain()
        g.gain.value = i === 0 ? 0.22 : 0.07
        o.connect(g).connect(filter)
        o.start()
        return o
      }),
    )
    lfo.start()
    this.ambient = {
      stop: () => {
        const t = ctx.currentTime
        out.gain.cancelScheduledValues(t)
        out.gain.setValueAtTime(out.gain.value, t)
        out.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
        ;[...oscs, lfo].forEach((o) => o.stop(t + 0.9))
      },
    }
  }

  stopAmbient() {
    this.ambient?.stop()
    this.ambient = null
  }
}

export const labAudio = new LabAudio()
