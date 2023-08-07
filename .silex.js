const DirectusStorage = require('./index')

module.exports = (config, opts) => {
  config.addStorageConnector(new DirectusStorage(config, {
    collection: 'silex',
    singleSiteMode: true,
    assetsLocalFolder: null,
  }))
}

