const Path = require('path');
const FS = require('fs');
const Config = require('./Config');
const Regex = require('pencl-base/src/Util/Regex');
const PenclError = require('pencl-base/src/Error/PenclError');

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
   * @param {(RegExp|string)} pattern
   * 
   * @returns {string[]}
   */
  list(pattern = null) {
    if (typeof pattern === 'string') {
      pattern = Regex.wildRegex(pattern);
    }

    const list = [];
    for (const file of FS.readdirSync(this.path)) {
      const name = Path.parse(file).name;
      if (pattern !== null && !Regex.wildTest(pattern, name)) continue;
      list.push(name);
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
      this._configs[name] = this.load(new Config(this, name));
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

  saveAll() {
    for (const name in this._configs) {
      this._configs[name].save();
    }
  }

}