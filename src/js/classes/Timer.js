export default class Timer {
    constructor() {
        this.timerModalWindow = document.querySelector(".timer");
        this.timerEl = document.querySelector(".timer__text");
        this.progressEl = document.querySelector(".timer__progress-line");
        this.sec = 3;
        this.timer = null;
        this.isStarted = false;
    }

    _setProgress() {
        const progress = (this.sec / 3) * 100;

        this.progressEl.style.width = `${progress}%`;
    }

    _renderTime() {
        this.timerEl.textContent = this.sec;
    }

    _stop() {
        clearInterval(this.timer);

        this._hide();
        this.isStarted = false;
    }

    _timerHandler() {
        if (this.sec <= 0) {
            return this._stop();
        }

        this.sec -= 1;

        this._renderTime();
        this._setProgress();
    }

    _hide() {
        this.sec = 3;
        this.timerModalWindow.classList.remove("show--flex");

        this._renderTime();
    }

    start() {
        this.timerModalWindow.classList.add("show--flex");

        this._setProgress();
        this.isStarted = true;

        this.timer = setInterval(this._timerHandler.bind(this), 1000);
    }
}