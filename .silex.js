const DirectusStorage = require('./index')

module.exports = (config, opts) => {
  config.addStorageConnector(new DirectusStorage(config, {
    ...opts,
  }))
}

