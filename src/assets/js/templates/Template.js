import Handler from '../app/Handler';

const Templates = {};

export class Template extends Handler {
  constructor() {
    super();
  }

  onState() {
    return false;
  }

  turnOff() { }

  turnOn() { }

  destroy() {
    super.destroy();
  }
}

Templates.Template = Template;
