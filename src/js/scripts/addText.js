import TypingLogic from "../classes/TypingLogic";
import ModalWindow from "../classes/ModalWindow";

export default () => {
    const form = document.querySelector("#add-text-form");
    const typingLogic = new TypingLogic().init();
    const typingHandler = typingLogic.typingHandler.bind(typingLogic);
    const callbackWhenHide = () => {
        typingLogic.clearTextData();
        typingLogic.setTypingEvent(typingHandler, false);
    };
    const callbackWhenShow = () => typingLogic.setTypingEvent(typingHandler);
    const modalWindow = new ModalWindow(callbackWhenHide, callbackWhenShow).init();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const fd = new FormData(form);
        const value = fd.get("text");

        if (!value) {
            return;
        }

        modalWindow.show();
        typingLogic.fillTextData(value);
    });
};