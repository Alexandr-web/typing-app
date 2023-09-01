import ConfettiGenerator from "confetti-js";

export default () => {
    new ConfettiGenerator({ target: "confetti", size: 2, max: 250, }).render();
};