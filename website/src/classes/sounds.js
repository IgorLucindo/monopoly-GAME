export class Sounds {
  constructor(soundsData) {
    this.audios = {}
    for (const [k, v] of Object.entries(soundsData)) {
      this.audios[k] = new Audio(v.path);
      this.audios[k].volume = v.volume;
    }
  }


  play(soundName, delay=0) {
    setTimeout(() => this.audios[soundName].play(), delay);
  }
}