export default (duration) => {
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
};