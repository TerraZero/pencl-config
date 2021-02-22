const Reflection = require('pencl-base/src/Util/Reflection');

module.exports = class Config {

  /**
   * @param {import('./ConfigManager')} manager 
   * @param {string} name
   */
  constructor(manager, name) {
    this.manager = manager;
    this.name = name;
    this.data = {};
    this.changed = false;
    this.isNew = false;
  }

  /**
   * @param {object} data 
   * @param {boolean} changed
   * 
   * @returns {this}
   */
  setData(data, changed = true) {
    this.data = data;
    this.changed = changed;
    return this;
  }

  /**
   * @returns {this}
   */
  load() {
    this.manager.load(this);
    return this;
  }

  /**
   * @returns {this}
   */
  save() {
    this.manager.save(this);
    return this;
  }

  /**
   * @param {string} field 
   * @param {*} value 
   * @param {array} args
   * 
   * @returns {this}
   */
  set(field, value, ...args) {
    Reflection.setDeep(this.data, field, value);
    this.changed = true;
    return this;
  }

  /**
   * @param {string} field 
   * @param {*} fallback 
   * @param {array} args
   * 
   * @returns {*}
   */
  get(field, fallback = null, ...args) {
    if (field.indexOf(':') !== -1) {
      const split = field.split(':');
      const value = Reflection.getDeep(this.data, split[0], fallback);

      if (typeof value === 'object') {
        switch (typeof value[split[1]]) {
          case 'function':
            return value[split[1]](...args);
          default:
            return value[split[1]];
        }
      }
      return fallback;
    }
    return Reflection.getDeep(this.data, field, fallback);
  }
  
}