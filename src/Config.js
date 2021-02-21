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

  set(field, ) {
    
  }

  get() {

  }
  
}