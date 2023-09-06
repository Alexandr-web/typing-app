import SpeedTimer from "./SpeedTimer";
import Timer from "./Timer";

import keys from "../helpers/keys";

export default class TypingLogic {
    constructor() {
        this.listText = document.querySelector(".typing-workspace__list-lines");
        this.listKeys = document.querySelector(".keyboard__keys");
        this.btnRepeat = document.querySelector(".typing-workspace__progress-repeat");
        this.progressLine = document.querySelector(".typing-workspace__progress-line-inner");
        this.countCompletedLinesEl = document.querySelector(".typing-workspace__progress-completed");
        this.canvasConfetti = document.querySelector("#confetti");
        this.errorsEl = document.querySelector('.typing-workspace__statistic[data-statistic="errors"] .typing-workspace__statistic-item');
        this.timeEl = document.querySelector('.typing-workspace__statistic[data-statistic="time"] .typing-workspace__statistic-item');
        this.speedEl = document.querySelector('.typing-workspace__statistic[data-statistic="speed"] .typing-workspace__statistic-item');
        this.speedTimer = new SpeedTimer().init();
        this.timer = new Timer();
        this.end = true;
        this.errors = 0;
        this.textData = [];
        this.ignoreKeys = ["Tab", "CapsLock", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "AltLeft", "AltRight", "ContextMenu"];
    }

    _renderCountCompletedLines() {
        const countCompletedTexts = this.textData.filter(({ completed, }) => completed).length;

        this.countCompletedLinesEl.textContent = `${countCompletedTexts}/${this.textData.length}`;
    }

    _renderKeys() {
        keys.forEach((rowArr) => {
            const rowKeys = document.createElement("div");
            
            rowKeys.classList.add("keyboard__row-keys");

            rowArr.forEach(({ className, str, key, }) => {
                const keyBlock = document.createElement("div");

                keyBlock.classList.add("key", className || "key--empty");

                keyBlock.textContent = str;
                keyBlock.dataset.key = key;

                rowKeys.appendChild(keyBlock);
            });

            this.listKeys.appendChild(rowKeys);
        });
    }

    _renderText() {
        this.listText.innerHTML = "";
        
        this.textData.forEach(({ sentence, }, idx) => {
            const HTMLLineStr = `
                <li class="typing-workspace__line" data-line-idx="${idx}">
                    <p class="typing-workspace__line-text text-keys">
                        <span class="key--completed"></span><span class="typing-workspace__line-text-not-completed">${sentence}</span>
                    </p>
                    <span class="typing-workspace__line-text-num">${idx + 1}</span>
                </li>
            `;

            this.listText.innerHTML += HTMLLineStr;
        });
    }

    _renderSpeed() {
        const completedLetters = this._getCountCompletedLetters();
        const min = (this.speedTimer.sec / 60) || 1;
        const speed = Math.round(completedLetters / min);
        
        this.speedEl.textContent = `${speed} (сим/мин)`;
    }

    _renderErrors() {
        this.errorsEl.textContent = this.errors;
    }

    fillTextData(text) {
        this.textData = text
            .split("\n")
            .reduce((acc, sentence, idx) => {
                const letters = sentence
                    .split("")
                    .map((letter, index) => ({ letter, active: index === 0 && idx === 0, completed: false, }));

                acc.push({
                    letters,
                    sentence,
                    active: idx === 0,
                    completed: false,
                });
                
                return acc;
            }, []);

        this.end = false;

        this._renderText();
        this._renderCountCompletedLines();
    }

    _setPressedKey(els, idx) {
        els.forEach((el) => el.classList.remove("active"));

        els[idx].classList.add("active");
    }

    _getCountCompletedLetters() {
        return this.textData.reduce((count, { letters, }) => count += letters.filter(({ completed, }) => completed).length, 0);
    }

    _getCountAllLetters() {
        return this.textData.reduce((count, { letters }) => count += letters.length, 0);
    }

    _setProgress() {
        const completedLetters = this._getCountCompletedLetters();
        const allLetters = this._getCountAllLetters();
        const progress = (completedLetters / allLetters) * 100;

        this.progressLine.style.width = `${progress}%`;
    }

    _setRepeat() {
        this.btnRepeat.addEventListener("click", this.clearTextData.bind(this));
    }

    clearTextData() {
        this.textData.forEach((sentence, idx) => {
            sentence.active = idx === 0;
            sentence.completed = false;
            sentence.letters.forEach((letter) => {
                letter.active = false;
                letter.completed = false;
            });
        });

        this.textData[0].letters[0].active = true;

        this.end = false;
        this.errors = 0;
        this.speed = 0;

        this.canvasConfetti.classList.remove("show-opacity");

        this._setProgress();
        this._renderCountCompletedLines();
        this._renderText();
        this._renderErrors();
        this._renderSpeed();
        this.speedTimer.stopAndClear();
    }

    _scrollToNextSentence(idxNextSentence) {
        const sentenceEl = document.querySelector(`.typing-workspace__line[data-line-idx="${idxNextSentence}"]`);

        sentenceEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    _startSentenceAgain(activeSentenceIdx) {
        this.textData[activeSentenceIdx].letters.forEach((letter, idx) => {
            letter.active = idx === 0;
            letter.completed = false;
        });
    }

    _clearKeysAtSentenceByIndex(idx) {
        const sentenceData = this.textData[idx];
        
        this._splitSentenceInHTML(idx, sentenceData);
    }

    _checkTyping(pressedKey) {
        const findActiveIdxSentence = this.textData.findIndex(({ active, }) => active);
        const sentenceData = this.textData[findActiveIdxSentence];
        const findActiveIdxKey = sentenceData.letters.findIndex(({ active, }) => active);
        const activeKey = sentenceData.letters[findActiveIdxKey].letter;

        if (this.ignoreKeys.includes(pressedKey)) {
            return;
        }

        if (activeKey !== pressedKey) {
            this.errors += 1;

            this._renderErrors();
            this._startSentenceAgain(findActiveIdxSentence);
            this._renderCountCompletedLines();
            this._clearKeysAtSentenceByIndex(findActiveIdxSentence);
            this._setProgress();

            this.timer.start();

            return;
        }

        // Отключаем текущую активную букву
        this.textData[findActiveIdxSentence].letters[findActiveIdxKey].completed = true;
        this.textData[findActiveIdxSentence].letters[findActiveIdxKey].active = false;

        if (findActiveIdxKey + 1 < this.textData[findActiveIdxSentence].letters.length) {
            // Включаем следующую активную букву
            this.textData[findActiveIdxSentence].letters[findActiveIdxKey + 1].active = true;
        } else {
            // Отключаем текущее активное предложение
            this.textData[findActiveIdxSentence].active = false;
            this.textData[findActiveIdxSentence].completed = true;

            if (findActiveIdxSentence + 1 < Object.keys(this.textData).length) {
                // Включаем следующее активное предложение и букву
                this.textData[findActiveIdxSentence + 1].active = true;
                this.textData[findActiveIdxSentence + 1].letters[0].active = true;

                this.speedTimer.stop();
                this._scrollToNextSentence(findActiveIdxSentence + 1);
            } else {
                this.canvasConfetti.classList.add("show-opacity");
    
                this.speedTimer.stop();
                this.end = true;
            }
        }

        this._setProgress();
        this._renderCountCompletedLines();
        this._splitSentenceInHTML(findActiveIdxSentence, sentenceData);
        this._renderSpeed();
    }

    _splitSentenceInHTML(idxLine, sentenceData) {
        const elLine = document.querySelector(`.typing-workspace__line[data-line-idx="${idxLine}"]`);
        const completedKeysEl = elLine.querySelector(".key--completed");
        const notCompletedKeysEl = elLine.querySelector(".typing-workspace__line-text-not-completed");
        const completedLetters = sentenceData.letters.filter(({ completed, }) => completed);
        const notCompletedLetters = sentenceData.letters.filter(({ completed, }) => !completed);
        const strCompletedLetters = completedLetters.reduce((str, { letter, }) => str += letter, "");
        const strNotCompletedLetters = notCompletedLetters.reduce((str, { letter, }) => str += letter, "");

        completedKeysEl.textContent = strCompletedLetters;
        notCompletedKeysEl.textContent = strNotCompletedLetters;
    }

    setTypingEvent(callback, add = true) {
        const eMethod = add ? "addEventListener" : "removeEventListener";
        
        window[eMethod]("keydown", callback);
    }

    typingHandler(e) {
        e.preventDefault();

        if (this.end || this.timer.isStarted) {
            return;
        }

        if (!this.speedTimer.isStarted) {
            this.speedTimer.start();
        }

        const keyEls = document.querySelectorAll(".key[data-key]");
        const code = e.code;
        const key = e.key;
        const findMatchIdx = [...keyEls].findIndex((el) => el.dataset.key === code);

        if (findMatchIdx === -1) {
            return;
        }

        this._setPressedKey(keyEls, findMatchIdx);
        this._checkTyping(key);
    }

    init() {
        this._renderKeys();
        this._renderSpeed();
        this._renderErrors();
        this._setRepeat();

        return this;
    }
}