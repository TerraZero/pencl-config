module.exports = class PenclConfig {

  
  static get ConfigManager() {
    return require('./src/ConfigManager');
  }

  static get Config() {
    return require('./src/Config');
  }

}