export default class Sound {
    constructor() {
        this.audioEl = document.createElement("audio");
        this.audioSrc = "./sounds/click.wav";
    }

    _setAudioElData() {
        this.audioEl.src = this.audioSrc;
    }

    play() {
        const promise = this.audioEl.play();

        if (promise instanceof Promise) {
            promise
                .then(() => {
                    this.audioEl.play();
                }).catch((err) => {
                    throw err;
                });
        }
    }

    init() {
        this._setAudioElData();

        return this;
    }
}