import keys from "../helpers/keys";

export default class TypingLogic {
    constructor() {
        this.listText = document.querySelector(".typing-workspace__list-lines");
        this.listKeys = document.querySelector(".keyboard__keys");
        this.btnRepeat = document.querySelector(".typing-workspace__progress-repeat");
        this.progressLine = document.querySelector(".typing-workspace__progress-line-inner");
        this.countCompletedLinesEl = document.querySelector(".typing-workspace__progress-completed");
        this.end = true;
        this.text = "";
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

    fillTextData(text) {
        this.textData = text
            .split("\n")
            .reduce((acc, sentence, idx) => {
                const letters = sentence
                    .split("")
                    .map((letter, idx) => ({ letter, active: idx === 0, completed: false, }));

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
        els.forEach((el) => el.classList.remove("key--pressed"));

        els[idx].classList.add("key--pressed");
    }

    _setProgress() {
        const completedLetters = this.textData.reduce((count, { letters, }) => count += letters.filter(({ completed, }) => completed).length, 0);
        const allLetters = this.textData.reduce((count, { letters }) => count += letters.length, 0);
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

        this._setProgress();
        this._renderCountCompletedLines();
        this._renderText();
    }

    _checkTyping(pressedKey) {
        const findActiveIdxSentence = this.textData.findIndex(({ active, }) => active);
        const sentenceData = this.textData[findActiveIdxSentence];
        const findActiveIdxKey = sentenceData.letters.findIndex(({ active, }) => active);
        const findKey = sentenceData.letters[findActiveIdxKey].letter;

        if (this.ignoreKeys.includes(pressedKey)) {
            return;
        }
        
        // TODO:
        // * Конец попытки на текущем предложении
        //   начинаем заново (только это предложение)
        if (findKey !== pressedKey) {
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
            } else {
                console.log("finish");
    
                this.end = true;
            }
        }

        this._setProgress();
        this._renderCountCompletedLines();
        this._splitSentenceInHTML(findActiveIdxSentence, sentenceData);
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

    addTyping() {
        const keyEls = document.querySelectorAll(".key[data-key]");

        window.addEventListener("keydown", (e) => this._typingHandler(e, keyEls));
    }

    removeTyping() {
        const keyEls = document.querySelectorAll(".key[data-key]");

        window.removeEventListener("keydown", (e) => this._typingHandler(e, keyEls));
    }

    _typingHandler(e, keyEls) {
        if (this.end) {
            return;
        }

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
        this._setRepeat();

        return this;
    }
}