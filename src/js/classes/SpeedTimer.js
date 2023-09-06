import getSTRTime from "../helpers/getSTRTime";

export default class SpeedTimer {
    constructor() {
        this.timerEl = document.querySelector('.typing-workspace__statistic[data-statistic="time"] .typing-workspace__statistic-item');
        this.timer = null;
        this.sec = 0;
        this.isStarted = false;
    }

    _renderTime() {
        this.timerEl.textContent = getSTRTime(this.sec);
    }

    _timerLogic() {
        this.sec += 1;
        
        this._renderTime();
    }

    start() {
        this.timer = setInterval(this._timerLogic.bind(this), 1000);

        this.isStarted = true;
    }

    stop() {
        clearInterval(this.timer);

        this.isStarted = false;
    }

    stopAndClear() {
        this.stop();

        this.sec = 0;

        this._renderTime();
    }

    clear() {
        this.sec = 0;
        this.isStarted = false;
        
        this._renderTime();
    }

    init() {
        this._renderTime();

        return this;
    }
}