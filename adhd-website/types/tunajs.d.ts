declare module 'tunajs' {
  interface TunaEffect {
    input: AudioNode;
    output?: AudioNode;
    connect(destination: AudioNode): void;
    disconnect(): void;
  }

  interface OverdriveOptions {
    outputGain?: number;
    drive?: number;
    curveAmount?: number;
    algorithmIndex?: number;
    bypass?: number;
  }

  interface DelayOptions {
    feedback?: number;
    delayTime?: number;
    wetLevel?: number;
    dryLevel?: number;
    cutoff?: number;
    bypass?: number;
  }

  interface ChorusOptions {
    intensity?: number;
    rate?: number;
    stereoPhase?: number;
    bypass?: number;
  }

  interface BitcrusherOptions {
    bits?: number;
    normfreq?: number;
    bypass?: number;
  }

  interface FilterOptions {
    frequency?: number;
    Q?: number;
    gain?: number;
    filterType?: string;
    bypass?: number;
  }

  interface ConvolverOptions {
    highCut?: number;
    lowCut?: number;
    dryLevel?: number;
    wetLevel?: number;
    level?: number;
    impulse?: string;
    bypass?: number;
  }

  class Tuna {
    constructor(context: AudioContext);
    
    Overdrive: new (options: OverdriveOptions) => TunaEffect;
    Delay: new (options: DelayOptions) => TunaEffect;
    Chorus: new (options: ChorusOptions) => TunaEffect;
    Bitcrusher: new (options: BitcrusherOptions) => TunaEffect;
    Filter: new (options: FilterOptions) => TunaEffect;
    Convolver: new (options: ConvolverOptions) => TunaEffect;
  }

  export default Tuna;
}
