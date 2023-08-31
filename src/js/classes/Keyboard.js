import keys from "../helpers/keys";

export default class Keyboard {
    constructor() {
        this.listKeys = document.querySelector(".keyboard__keys");
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

    init() {
        window.addEventListener("keydown", (e) => {
            console.log(e.code);
        });

        this._renderKeys();
    }
}