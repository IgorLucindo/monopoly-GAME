export class Sounds {
  constructor(soundsData) {
    this.audios = {}
    for (const [k, v] of Object.entries(soundsData)) {
      this.audios[k] = new Audio(v.path);
    }
  }


  play(soundName) {
    this.audios[soundName].play();
  }
}