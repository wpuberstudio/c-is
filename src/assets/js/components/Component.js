import Handler from '../app/Handler';

export default class Component extends Handler {
  constructor() {
    super();
  }

  preloadImages() {
    return [];
  }

  onState() {
    return false;
  }

  animateIn(index, delay) {

  }

  animateOut() {
    return Promise.resolve(true);
  }

  turnOff() { }

  turnOn() { }

  resize(wdt, hgt) { }

  destroy() {
    super.destroy();
  }
}