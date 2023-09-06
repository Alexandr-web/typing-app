export default class Timer {
    constructor() {
        this.timerEl = document.querySelector('.typing-workspace__statistic[data-statistic="time"] .typing-workspace__statistic-item');
        this.timer = null;
        this.sec = 0;
        this.isStarted = false;
    }

    _getSTRTime(duration) {
        let hours = Math.floor(duration / 3600);
        let min = Math.floor((duration - (hours * 3600)) / 60);
        let sec = Math.floor(duration - (hours * 3600) - (min * 60));
    
        if (hours < 10) {
            hours = `0${hours}`;
        }
    
        if (min < 10) {
            min = `0${min}`;
        }
    
        if (sec < 10) {
            sec = `0${sec}`;
        }
    
        return `${hours > 0 ? hours + ":" : ""}${min}:${sec}`;
    }

    _renderTime() {
        this.timerEl.textContent = this._getSTRTime(this.sec);
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