// Audio del Lab con Web Audio.
// - Efectos reales CC0 de Kenney (www.kenney.nl) en /public/lab/audio con variación de tono;
//   mientras cargan (o si fallan) suena la versión sintetizada.
// - Música adaptativa por capas (pad, bajo, arpegio, percusión) programada con anticipación,
//   que el juego controla con intensidad, turbo y "filtro" (batería baja, pausa).
// - Reverberación de montaña, paneo estéreo y bucles de proximidad para los obstáculos.
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
  | "step"
  | "hit-bug"
  | "hit-rock"
  | "hit-metal"
  | "hit-wood"
  | "powerup"
  | "shield-break"
  | "boost"
  | "magnet"
  | "double"
  | "coffee"
  | "laser"
  | "toggle"
  | "done"

// Variantes por efecto: se elige una al azar para que las repeticiones no suenen iguales.
// `music: true` = fanfarria: suena por el canal de música y baja el resto un momento.
const SAMPLES: Partial<Record<SfxName, { files: string[]; gain: number; music?: boolean; reverb?: number }>> = {
  step: { files: ["step-0", "step-1", "step-2", "step-3", "step-4"], gain: 0.2, reverb: 0.05 },
  jump: { files: ["jump-1"], gain: 0.32 },
  land: { files: ["land-1", "land-2"], gain: 0.5 },
  pickup: { files: ["pickup-1", "pickup-2", "pickup-3"], gain: 0.42, reverb: 0.35 },
  combo: { files: ["combo-1", "combo-2"], gain: 0.5, reverb: 0.3 },
  milestone: { files: ["jingle-milestone"], gain: 0.75, music: true, reverb: 0.3 },
  win: { files: ["jingle-win"], gain: 0.85, music: true, reverb: 0.35 },
  lose: { files: ["jingle-lose"], gain: 0.75, music: true, reverb: 0.3 },
  done: { files: ["jingle-done"], gain: 0.8, music: true, reverb: 0.3 },
  "hit-bug": { files: ["hit-bug-0", "hit-bug-1", "hit-bug-2"], gain: 0.9, reverb: 0.2 },
  "hit-rock": { files: ["hit-rock-0", "hit-rock-1", "hit-rock-2"], gain: 0.9, reverb: 0.3 },
  "hit-metal": { files: ["hit-metal-0", "hit-metal-1", "hit-metal-2"], gain: 0.8, reverb: 0.35 },
  "hit-wood": { files: ["hit-wood-0", "hit-wood-1", "hit-wood-2"], gain: 0.9, reverb: 0.25 },
  powerup: { files: ["powerup-1", "powerup-2"], gain: 0.5, reverb: 0.3 },
  coffee: { files: ["coffee-1"], gain: 0.5, reverb: 0.2 },
  "shield-break": { files: ["shield-break-1"], gain: 0.7, reverb: 0.4 },
  boost: { files: ["boost-1"], gain: 0.55, reverb: 0.2 },
  magnet: { files: ["magnet-1"], gain: 0.5, reverb: 0.2 },
  double: { files: ["double-1"], gain: 0.5, reverb: 0.2 },
  click: { files: ["click-1", "click-2"], gain: 0.5 },
  toggle: { files: ["toggle-1"], gain: 0.5 },
  error: { files: ["error-1", "error-2"], gain: 0.5 },
  place: { files: ["place-1", "place-2"], gain: 0.6, reverb: 0.2 },
  remove: { files: ["remove-1"], gain: 0.5 },
  squash: { files: ["squash-1"], gain: 0.8, reverb: 0.15 },
  laser: { files: ["laser-1", "laser-2"], gain: 0.45, reverb: 0.25 },
}

export type Mood = "night" | "focus" | "build"
export type PlayOpts = { pan?: number; gain?: number; rate?: number }
export type LoopName = "rumble" | "buzz"
export type LoopHandle = { set: (gain: number, pan?: number, rate?: number) => void; stop: () => void }

// Progresiones: tónica (Hz), acordes en semitonos sobre la tónica, tempo
const MOODS: Record<Mood, { root: number; bpm: number; chords: number[][]; swing: number }> = {
  // Re menor nocturno: i – VI – III – VII
  night: { root: 146.83, bpm: 86, chords: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]], swing: 0.06 },
  // La menor enfocado y más rápido para el sprint
  focus: { root: 110, bpm: 118, chords: [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-2, 2, 5]], swing: 0 },
  // Mi mayor luminoso para armar la app: I – V – vi – IV
  build: { root: 164.81, bpm: 96, chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], swing: 0.04 },
}

const MUTE_KEY = "avila-lab-muted"
const VOL_KEY = "avila-lab-volume"
const semis = (f: number, s: number) => f * Math.pow(2, s / 12)

type Volumes = { music: number; sfx: number }

class LabAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private sfxBus: GainNode | null = null
  private musicBus: GainNode | null = null
  private musicDuck: GainNode | null = null
  private musicFilter: BiquadFilterNode | null = null
  private reverb: ConvolverNode | null = null
  private reverbIn: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private buffers = new Map<string, AudioBuffer>()
  private loading = false
  private listeners = new Set<(muted: boolean) => void>()
  private volListeners = new Set<(v: Volumes) => void>()
  private music: { stop: () => void } | null = null
  private intensity = 0.35
  private turbo = false
  muted = false
  volumes: Volumes = { music: 0.7, sfx: 0.9 }

  constructor() {
    if (typeof window === "undefined") return
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === "1"
      const v = JSON.parse(localStorage.getItem(VOL_KEY) ?? "null") as Volumes | null
      if (v && typeof v.music === "number" && typeof v.sfx === "number") this.volumes = v
    } catch {
      // ignorar
    }
  }

  unlock() {
    if (typeof window === "undefined") return
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = new Ctor()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.85
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -12
      comp.ratio.value = 3.5
      comp.attack.value = 0.004
      comp.release.value = 0.2
      this.master.connect(comp).connect(ctx.destination)

      // Reverberación: respuesta al impulso sintética, cola de ~2,6 s como un valle abierto
      this.reverb = ctx.createConvolver()
      this.reverb.buffer = this.impulse(2.6, 2.8)
      this.reverbIn = ctx.createGain()
      this.reverbIn.gain.value = 0.9
      const revOut = ctx.createGain()
      revOut.gain.value = 0.55
      this.reverbIn.connect(this.reverb).connect(revOut).connect(this.master)

      this.sfxBus = ctx.createGain()
      this.sfxBus.gain.value = this.volumes.sfx
      this.sfxBus.connect(this.master)

      // Música: entrada → filtro (batería baja / pausa) → atenuación por golpes → volumen
      this.musicFilter = ctx.createBiquadFilter()
      this.musicFilter.type = "lowpass"
      this.musicFilter.frequency.value = 18000
      this.musicFilter.Q.value = 0.7
      this.musicDuck = ctx.createGain()
      this.musicBus = ctx.createGain()
      this.musicBus.gain.value = this.volumes.music * 0.5
      this.musicFilter.connect(this.musicDuck).connect(this.musicBus).connect(this.master)
      const musicSend = ctx.createGain()
      musicSend.gain.value = 0.35
      this.musicDuck.connect(musicSend).connect(this.reverbIn)

      const len = ctx.sampleRate * 2
      this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = this.noiseBuffer.getChannelData(0)
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === "suspended") void this.ctx.resume()
    void this.loadSamples()
  }

  private impulse(seconds: number, decay: number) {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch += 1) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < len; i += 1) {
        const t = i / len
        // Primeras reflexiones dispersas y cola que se oscurece
        const early = i < ctx.sampleRate * 0.08 && Math.random() < 0.004 ? 0.8 : 0
        d[i] = ((Math.random() * 2 - 1) * 0.6 + early) * Math.pow(1 - t, decay)
      }
    }
    return buf
  }

  private async loadSamples() {
    if (this.loading || !this.ctx) return
    this.loading = true
    const ctx = this.ctx
    const files = new Set(Object.values(SAMPLES).flatMap((s) => s!.files))
    await Promise.all(
      [...files].map(async (f) => {
        try {
          const res = await fetch(`/lab/audio/${f}.mp3`)
          const buf = await ctx.decodeAudioData(await res.arrayBuffer())
          this.buffers.set(f, buf)
        } catch {
          // sin ese archivo se usa la versión sintetizada
        }
      }),
    )
  }

  // ---------- Volumen ----------
  setMuted(muted: boolean) {
    this.muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0")
    } catch {
      // ignorar
    }
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.05)
    this.listeners.forEach((fn) => fn(muted))
  }

  setVolume(kind: keyof Volumes, value: number) {
    this.volumes = { ...this.volumes, [kind]: Math.max(0, Math.min(1, value)) }
    try {
      localStorage.setItem(VOL_KEY, JSON.stringify(this.volumes))
    } catch {
      // ignorar
    }
    if (this.ctx) {
      const t = this.ctx.currentTime
      this.sfxBus?.gain.setTargetAtTime(this.volumes.sfx, t, 0.05)
      this.musicBus?.gain.setTargetAtTime(this.volumes.music * 0.5, t, 0.05)
    }
    this.volListeners.forEach((fn) => fn(this.volumes))
  }

  subscribe(fn: (muted: boolean) => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  subscribeVolume(fn: (v: Volumes) => void) {
    this.volListeners.add(fn)
    return () => {
      this.volListeners.delete(fn)
    }
  }

  /** Bajada momentánea de la música para que un golpe o una fanfarria se escuchen. */
  duck(amount = 0.4, seconds = 0.35) {
    if (!this.ctx || !this.musicDuck) return
    const t = this.ctx.currentTime
    const g = this.musicDuck.gain
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(amount, t + 0.03)
    g.linearRampToValueAtTime(1, t + seconds)
  }

  // ---------- Música adaptativa ----------
  /** 0 = calma (pad), 1 = máxima (bajo, arpegio y percusión completos). */
  setIntensity(v: number) {
    this.intensity = Math.max(0, Math.min(1, v))
  }

  setTurbo(on: boolean) {
    this.turbo = on
  }

  /** 1 = música abierta; valores bajos la oscurecen (batería baja, pausa). */
  setMusicTone(brightness: number) {
    if (!this.ctx || !this.musicFilter) return
    const f = 350 * Math.pow(18000 / 350, Math.max(0, Math.min(1, brightness)))
    this.musicFilter.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.25)
  }

  startAmbient(mood: Mood = "night") {
    if (!this.ctx || !this.musicFilter) return
    this.stopAmbient()
    const ctx = this.ctx
    const cfg = MOODS[mood]
    const out = ctx.createGain()
    out.gain.setValueAtTime(0.0001, ctx.currentTime)
    out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2)
    out.connect(this.musicFilter)
    this.setMusicTone(1)

    const stepDur = 60 / cfg.bpm / 4
    let step = 0
    let nextTime = ctx.currentTime + 0.1
    const voices: AudioScheduledSourceNode[] = []

    const note = (freq: number, t: number, o: { type: OscillatorType; dur: number; gain: number; attack?: number; cutoff?: number; detune?: number }) => {
      const osc = ctx.createOscillator()
      osc.type = o.type
      osc.frequency.value = freq
      if (o.detune) osc.detune.value = o.detune
      const g = ctx.createGain()
      const a = o.attack ?? 0.008
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(o.gain, t + a)
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
      if (o.cutoff) {
        const f = ctx.createBiquadFilter()
        f.type = "lowpass"
        f.frequency.value = o.cutoff
        osc.connect(f).connect(g)
      } else osc.connect(g)
      g.connect(out)
      osc.start(t)
      osc.stop(t + o.dur + 0.05)
    }
    const hit = (t: number, o: { freq: number; type: BiquadFilterType; dur: number; gain: number }) => {
      if (!this.noiseBuffer) return
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer
      src.playbackRate.value = 1 + Math.random() * 0.2
      const f = ctx.createBiquadFilter()
      f.type = o.type
      f.frequency.value = o.freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(o.gain, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
      src.connect(f).connect(g).connect(out)
      src.start(t, Math.random())
      src.stop(t + o.dur + 0.02)
    }
    const kick = (t: number, gain: number) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.setValueAtTime(140, t)
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.14)
      g.gain.setValueAtTime(gain, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      osc.connect(g).connect(out)
      osc.start(t)
      osc.stop(t + 0.32)
    }

    const schedule = (t: number) => {
      const bar = Math.floor(step / 16) % cfg.chords.length
      const s = step % 16
      const chord = cfg.chords[bar].map((x) => semis(cfg.root, x))
      const I = this.intensity
      const barDur = stepDur * 16
      // Pad: acorde largo con ataque lento, siempre presente
      if (s === 0) {
        chord.forEach((f, i) => {
          note(f, t, { type: "sawtooth", dur: barDur * 1.05, gain: 0.035, attack: barDur * 0.3, cutoff: 700 + I * 900, detune: i * 4 - 4 })
          note(f, t, { type: "sine", dur: barDur * 1.05, gain: 0.05, attack: barDur * 0.25 })
        })
      }
      // Bajo: raíz en un patrón sincopado
      if (I > 0.2 && [0, 3, 6, 8, 11, 14].includes(s) && (I > 0.55 || s % 8 === 0 || s === 6)) {
        note(chord[0] / 2, t, { type: "triangle", dur: stepDur * 2.6, gain: 0.16, cutoff: 500 })
      }
      // Arpegio: notas del acorde subiendo; con turbo cada semicorchea y una octava arriba
      const arpEvery = this.turbo ? 1 : 2
      if (I > 0.4 && s % arpEvery === 0) {
        const idx = (s / arpEvery) % 4
        const f = chord[idx % 3] * (idx === 3 ? 2 : 1) * (this.turbo ? 4 : 2)
        note(f, t, { type: "triangle", dur: stepDur * 1.8, gain: 0.045 + I * 0.02 })
      }
      // Percusión suave
      if (I > 0.35 && s % 8 === 0) kick(t, 0.35 * I)
      if (I > 0.6 && s % 2 === 1) hit(t, { freq: 7000, type: "highpass", dur: 0.04, gain: 0.05 * I })
      if (I > 0.75 && (s === 4 || s === 12)) hit(t, { freq: 1800, type: "bandpass", dur: 0.12, gain: 0.12 })
      // Melodía ocasional: notas pentatónicas sueltas en la calma
      if (I < 0.55 && s % 4 === 2 && Math.random() < 0.18) {
        const penta = [0, 3, 5, 7, 10, 12]
        note(semis(cfg.root * 4, penta[Math.floor(Math.random() * penta.length)]), t, { type: "sine", dur: 1.4, gain: 0.04 })
      }
    }

    const timer = window.setInterval(() => {
      while (nextTime < ctx.currentTime + 0.15) {
        const swing = step % 2 === 1 ? stepDur * cfg.swing : 0
        schedule(nextTime + swing)
        nextTime += stepDur
        step += 1
      }
    }, 25)

    // Ambiente nocturno: viento y grillos, con su propio paneo
    const ambienceTimers: number[] = []
    if (mood === "night" && this.noiseBuffer) {
      const wind = ctx.createBufferSource()
      wind.buffer = this.noiseBuffer
      wind.loop = true
      const wf = ctx.createBiquadFilter()
      wf.type = "lowpass"
      wf.frequency.value = 380
      const wg = ctx.createGain()
      wg.gain.value = 0.07
      const wl = ctx.createOscillator()
      const wlg = ctx.createGain()
      wl.frequency.value = 0.07
      wlg.gain.value = 0.05
      wl.connect(wlg).connect(wg.gain)
      wind.connect(wf).connect(wg).connect(out)
      wind.start()
      wl.start()
      voices.push(wind, wl)
      const chirp = () => {
        const t = ctx.currentTime + 0.01
        const f = 4300 + Math.random() * 700
        const pan = ctx.createStereoPanner()
        pan.pan.value = Math.random() * 1.8 - 0.9
        pan.connect(out)
        for (let k = 0; k < 3; k += 1) {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.frequency.value = f
          const st = t + k * 0.07
          g.gain.setValueAtTime(0.0001, st)
          g.gain.exponentialRampToValueAtTime(0.014, st + 0.01)
          g.gain.exponentialRampToValueAtTime(0.0001, st + 0.05)
          o.connect(g).connect(pan)
          o.start(st)
          o.stop(st + 0.06)
        }
        ambienceTimers[0] = window.setTimeout(chirp, 300 + Math.random() * 1400)
      }
      ambienceTimers[0] = window.setTimeout(chirp, 600)
    }

    this.music = {
      stop: () => {
        window.clearInterval(timer)
        ambienceTimers.forEach((id) => window.clearTimeout(id))
        const t = ctx.currentTime
        out.gain.cancelScheduledValues(t)
        out.gain.setValueAtTime(Math.max(0.0001, out.gain.value), t)
        out.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
        voices.forEach((v) => v.stop(t + 0.9))
        window.setTimeout(() => out.disconnect(), 1200)
      },
    }
  }

  stopAmbient() {
    this.music?.stop()
    this.music = null
  }

  // ---------- Bucles de proximidad ----------
  /** Sonido continuo que el juego modula según la distancia (roca rodando, zumbido del bug). */
  loop(name: LoopName): LoopHandle | null {
    if (!this.ctx || !this.sfxBus || !this.noiseBuffer) return null
    const ctx = this.ctx
    const g = ctx.createGain()
    g.gain.value = 0
    const pan = ctx.createStereoPanner()
    g.connect(pan).connect(this.sfxBus)
    const sources: AudioScheduledSourceNode[] = []
    let setRate: (r: number) => void = () => undefined
    if (name === "rumble") {
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer
      src.loop = true
      const f = ctx.createBiquadFilter()
      f.type = "lowpass"
      f.frequency.value = 140
      f.Q.value = 3
      const crunch = ctx.createBiquadFilter()
      crunch.type = "bandpass"
      crunch.frequency.value = 900
      const cg = ctx.createGain()
      cg.gain.value = 0.15
      src.connect(f).connect(g)
      src.connect(crunch).connect(cg).connect(g)
      src.start()
      sources.push(src)
      setRate = (r) => f.frequency.setTargetAtTime(110 + r * 80, ctx.currentTime, 0.1)
    } else {
      // Zumbido de insecto: dos cuadradas desafinadas con trémolo rápido
      const trem = ctx.createOscillator()
      const tremG = ctx.createGain()
      trem.frequency.value = 34
      tremG.gain.value = 0.5
      const body = ctx.createGain()
      body.gain.value = 0.5
      trem.connect(tremG).connect(body.gain)
      const bp = ctx.createBiquadFilter()
      bp.type = "bandpass"
      bp.frequency.value = 1100
      bp.Q.value = 2
      const oscs = [190, 197].map((f) => {
        const o = ctx.createOscillator()
        o.type = "square"
        o.frequency.value = f
        o.connect(body)
        o.start()
        return o
      })
      body.connect(bp).connect(g)
      trem.start()
      sources.push(trem, ...oscs)
      setRate = (r) => oscs.forEach((o, i) => o.frequency.setTargetAtTime((190 + i * 7) * (0.9 + r * 0.25), ctx.currentTime, 0.1))
    }
    return {
      set: (gain, p = 0, rate = 0.5) => {
        const t = ctx.currentTime
        g.gain.setTargetAtTime(this.muted ? 0 : gain, t, 0.08)
        pan.pan.setTargetAtTime(Math.max(-1, Math.min(1, p)), t, 0.08)
        setRate(rate)
      },
      stop: () => {
        const t = ctx.currentTime
        g.gain.setTargetAtTime(0, t, 0.05)
        sources.forEach((s) => s.stop(t + 0.3))
        window.setTimeout(() => g.disconnect(), 500)
      },
    }
  }

  // ---------- Efectos ----------
  private route(gainNode: GainNode, pan: number, reverb: number, toMusic = false) {
    const ctx = this.ctx!
    let node: AudioNode = gainNode
    if (pan !== 0) {
      const p = ctx.createStereoPanner()
      p.pan.value = Math.max(-1, Math.min(1, pan))
      gainNode.connect(p)
      node = p
    }
    node.connect(toMusic ? this.musicBus! : this.sfxBus!)
    if (reverb > 0 && this.reverbIn) {
      const send = ctx.createGain()
      send.gain.value = reverb
      node.connect(send).connect(this.reverbIn)
    }
  }

  /** Reproduce una variante del efecto; devuelve false si aún no hay archivos cargados. */
  private sample(name: SfxName, variance: number, opts: PlayOpts) {
    const def = SAMPLES[name]
    if (!def || !this.ctx || !this.sfxBus) return false
    const file = def.files[Math.floor(Math.random() * def.files.length)]
    const buf = this.buffers.get(file)
    if (!buf) return false
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    if (!def.music) src.playbackRate.value = opts.rate ?? 1 + (variance - 0.5) * 0.14
    const g = this.ctx.createGain()
    g.gain.value = def.gain * (opts.gain ?? 1) * (def.music ? 2 : 1)
    src.connect(g)
    this.route(g, opts.pan ?? 0, def.reverb ?? 0.1, def.music)
    if (def.music) this.duck(0.15, buf.duration + 0.4)
    src.start()
    return true
  }

  private tone(o: { freq: number; to?: number; type?: OscillatorType; dur: number; gain?: number; delay?: number; attack?: number; pan?: number; reverb?: number }) {
    if (!this.ctx || !this.sfxBus) return
    const t = this.ctx.currentTime + (o.delay ?? 0)
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = o.type ?? "sine"
    osc.frequency.setValueAtTime(o.freq, t)
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur)
    const peak = o.gain ?? 0.25
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + (o.attack ?? 0.005))
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
    osc.connect(g)
    this.route(g, o.pan ?? 0, o.reverb ?? 0.1)
    osc.start(t)
    osc.stop(t + o.dur + 0.05)
  }

  private noise(o: { dur: number; gain?: number; freq?: number; to?: number; type?: BiquadFilterType; delay?: number; q?: number; pan?: number }) {
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
    src.connect(filter).connect(g)
    this.route(g, o.pan ?? 0, 0.1)
    src.start(t, Math.random())
    src.stop(t + o.dur + 0.05)
  }

  /**
   * `variance` en [0,1) desplaza el tono ±7 % para que las repeticiones no suenen a máquina.
   * `pan` ubica el sonido a la izquierda (-1) o derecha (1) según dónde ocurre en la escena.
   */
  play(name: SfxName, variance = 0.5, opts: PlayOpts = {}) {
    if (!this.ctx || this.muted) return
    const p = 1 + (variance - 0.5) * 0.12
    const pan = opts.pan ?? 0
    // Golpes: muestra real del material + capa grave sintetizada para que pese
    if (name.startsWith("hit-")) {
      this.sample(name, variance, opts)
      this.duck(0.3, 0.5)
      this.tone({ freq: 120 * p, to: 45, type: "sine", dur: 0.28, gain: 0.22, pan: pan * 0.5 })
      return
    }
    if (this.sample(name, variance, opts)) return
    switch (name) {
      case "click":
        this.tone({ freq: 880 * p, to: 660 * p, type: "triangle", dur: 0.06, gain: 0.12, pan })
        break
      case "pickup":
        this.tone({ freq: 988 * p, type: "triangle", dur: 0.09, gain: 0.18, pan })
        this.tone({ freq: 1480 * p, type: "sine", dur: 0.18, gain: 0.14, delay: 0.05, pan })
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
        this.tone({ freq: 160 * p, to: 50, type: "sawtooth", dur: 0.32, gain: 0.26, pan })
        this.noise({ dur: 0.25, gain: 0.34, freq: 900, to: 200, type: "lowpass", pan })
        break
      case "whoosh":
        this.noise({ dur: 0.28, gain: 0.12, freq: 600, to: 2600, type: "bandpass", q: 1.4, pan })
        break
      case "milestone":
        ;[523, 659, 784].forEach((f, i) => this.tone({ freq: f, type: "triangle", dur: 0.32, gain: 0.14, delay: i * 0.07, reverb: 0.3 }))
        break
      case "win":
      case "done":
        this.duck(0.2, 2)
        ;[523, 659, 784, 1047, 1319].forEach((f, i) => this.tone({ freq: f, type: "triangle", dur: 0.6, gain: 0.15, delay: i * 0.11, reverb: 0.3 }))
        this.tone({ freq: 262, type: "sine", dur: 1.6, gain: 0.18, delay: 0.1 })
        break
      case "lose":
        ;[392, 330, 262].forEach((f, i) => this.tone({ freq: f, to: f * 0.96, type: "triangle", dur: 0.36, gain: 0.14, delay: i * 0.14, reverb: 0.3 }))
        break
      case "squash":
        this.noise({ dur: 0.12, gain: 0.3, freq: 1800, to: 300, type: "bandpass", q: 2, pan })
        this.tone({ freq: 220 * p, to: 90, type: "square", dur: 0.1, gain: 0.08, pan })
        break
      case "error":
        this.tone({ freq: 196, type: "square", dur: 0.12, gain: 0.08, pan })
        this.tone({ freq: 185, type: "square", dur: 0.16, gain: 0.08, delay: 0.1, pan })
        break
      case "combo":
        this.tone({ freq: 1175 * p, type: "triangle", dur: 0.12, gain: 0.12, pan })
        this.tone({ freq: 1760 * p, type: "sine", dur: 0.22, gain: 0.1, delay: 0.06, pan })
        break
      case "place":
        this.tone({ freq: 140 * p, to: 70, type: "sine", dur: 0.18, gain: 0.3, pan })
        this.tone({ freq: 1320 * p, type: "triangle", dur: 0.08, gain: 0.08, delay: 0.02, pan })
        break
      case "step":
        this.noise({ dur: 0.06, gain: 0.06, freq: 500, type: "lowpass", pan })
        break
      case "powerup":
      case "double":
      case "magnet":
      case "coffee":
        ;[523, 784, 1047].forEach((f, i) => this.tone({ freq: f * p, type: "square", dur: 0.12, gain: 0.07, delay: i * 0.05, pan }))
        break
      case "boost":
        this.tone({ freq: 200, to: 900, type: "sawtooth", dur: 0.4, gain: 0.08 })
        break
      case "shield-break":
        this.noise({ dur: 0.35, gain: 0.3, freq: 4000, to: 800, type: "bandpass", q: 1.2, pan })
        break
      case "laser":
        this.tone({ freq: 1400, to: 300, type: "square", dur: 0.18, gain: 0.07, pan })
        break
      case "toggle":
        this.tone({ freq: 660, type: "triangle", dur: 0.05, gain: 0.1 })
        break
      case "heartbeat":
        this.tone({ freq: 70, to: 45, type: "sine", dur: 0.14, gain: 0.32, reverb: 0 })
        this.tone({ freq: 62, to: 40, type: "sine", dur: 0.16, gain: 0.24, delay: 0.17, reverb: 0 })
        break
      case "remove":
        this.tone({ freq: 520 * p, to: 260 * p, type: "triangle", dur: 0.14, gain: 0.1, pan })
        break
    }
  }
}

export const labAudio = new LabAudio()

// Solo en desarrollo: acceso para pruebas automáticas de la mezcla
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  ;(window as unknown as { __labAudio?: LabAudio }).__labAudio = labAudio
}
