export class Sounds {
  constructor(soundsData) {
    this.data = soundsData;
    this.audios = {}
  }


  init() {
    this.createAudios();
  }

  
  createAudios() {
    for (const [k, v] of Object.entries(this.data)) {
      this.audios[k] = new Audio(v.path);
      this.audios[k].volume = v.volume;
    }
  }


  play(soundName, delay=0) {
    setTimeout(() => this.audios[soundName].play(), delay);
  }
}