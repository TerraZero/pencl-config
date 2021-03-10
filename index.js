const PenclPlugin = require('pencl-base/src/Boot/PenclPlugin');
const ConfigManager = require('./src/ConfigManager');

class PenclConfig extends PenclPlugin {

  static get name() {
    return 'config';
  }

  static get config() {
    return {
      path: '~/data/configs',
    };
  }

  constructor() {
    super();
    this._manager = null;
  }

  get manager() {
    if (this._manager === null) {
      this._manager = new ConfigManager(this.config.path);
    }
    return this._manager;
  }

}

module.exports = new PenclConfig();