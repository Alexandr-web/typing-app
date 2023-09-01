export default class ModalWindow {
    constructor(callbackWhenHide, callbackWhenShow, selectorModalWindow = ".modal-window") {
        this.modalWindow = document.querySelector(selectorModalWindow);
        this.callbackWhenHide = callbackWhenHide;
        this.callbackWhenShow = callbackWhenShow;
    }

    _setHide() {
        this.modalWindow.addEventListener("click", (e) => {
            const target = e.target;

            if (target.classList.contains("modal-window") || target.classList.contains("modal-window__inner")) {
                if (this.callbackWhenHide instanceof Function) {
                    this.callbackWhenHide();
                }

                this.modalWindow.classList.remove("show");
            }
        });
    }

    show() {
        if (this.callbackWhenShow instanceof Function) {
            this.callbackWhenShow();
        }

        this.modalWindow.classList.add("show");
        
        return this;
    }

    init() {
        this._setHide();

        return this;
    }
}