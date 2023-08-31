import keys from "../helpers/keys";

export default class Keyboard {
    constructor(text = "Hello, world!\nHello, world!\nHello, world!") {
        this.listText = document.querySelector(".typing-workspace__list-lines");
        this.listKeys = document.querySelector(".keyboard__keys");
        this.text = text;
        this.textData = [];
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
        this.textData.forEach(({ sentence, }, idx) => {
            const HTMLLineStr = `
                <li class="typing-workspace__line">
                    <p class="typing-workspace__line-text text-keys">
                        <span class="key--completed">${sentence}</span>
                    </p>
                    <span class="typing-workspace__line-text-num">${idx + 1}</span>
                </li>
            `;

            this.listText.innerHTML += HTMLLineStr;
        });
    }

    _fillTextData() {
        this.textData = this
            .text
            .split("\n")
            .reduce((acc, sentence, idx) => {
                const letters = sentence
                    .split("")
                    .map((letter, idx) => ({ letter, active: idx === 0, completed: false, }));

                acc.push({
                    letters,
                    sentence,
                    active: idx === 0,
                });
                
                return acc;
            }, []);

            console.log(this.textData);
    }

    _setPressedKey(els, idx) {
        els.forEach((el) => el.classList.remove("key--pressed"));

        els[idx].classList.add("key--pressed");
    }

    _typing() {
        const keyEls = document.querySelectorAll(".key[data-key]");

        window.addEventListener("keydown", (e) => {
            e.preventDefault();

            const key = e.code;
            const findMatchIdx = [...keyEls].findIndex((el) => el.dataset.key === key);
            
            if (findMatchIdx === -1) {
                return;
            }

            this._setPressedKey(keyEls, findMatchIdx);
        });
    }

    init() {
        this._fillTextData();
        this._renderText();
        this._renderKeys();
        this._typing();
    }
}