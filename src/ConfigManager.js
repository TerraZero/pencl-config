const Path = require('path');
const FS = require('fs');
const Config = require('./Config');
const { PenclError } = require('pencl-base');

module.exports = class ConfigManager {

  constructor(path) {
    this.path = Path.normalize(path);
    this._configs = {};
  }

  /**
   * @param {Config} config 
   * 
   * @returns {string}
   */
  getPath(config) {
    return Path.join(this.path, config.name + '.json');
  }

  /**
   * @returns {string[]}
   */
  list() {
    const list = [];
    for (const file of FS.readdirSync(this.path)) {
      list.push(Path.parse(file).name);
    }
    return list;
  }

  /**
   * @param {string} name 
   * 
   * @returns {Config}
   */
  get(name) {
    if (this._configs[name] === undefined) {
      this._configs[name] = this.load(new Config(name));
    }
    return this._configs[name];
  }

  /**
   * @param {Config} config
   * 
   * @returns {Config}
   */
  load(config) {
    const path = this.getPath(config);
    if (FS.existsSync(path)) {
      delete require.cache[require.resolve(path)];
      config.setData(require(path), false);
    } else {
      config.isNew = true;
    }
    return config;
  }

  /**
   * @param {Config} config
   * 
   * @returns {Config}
   */
  save(config) {
    if (config.changed) {
      const path = this.getPath(config);
      try {
        FS.writeFileSync(path, JSON.stringify(config.data, null, 2));
        config.changed = false;
      } catch (error) {
        throw new PenclError('Could not save the config "' + config.name + '" in "' + path + '"', { error, config });
      }
    }
    return config;
  }

}