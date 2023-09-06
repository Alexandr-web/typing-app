import "simplebar";
import ResizeObserver from 'resize-observer-polyfill';

export default () => {
    window.ResizeObserver = ResizeObserver;
};