# Directus plugin for Silex website builder

This plugin is a connector to integrate Silex with Directus, enabling users to store their websites and assets in their Directus account.

Silex prompt for login with directus: ![Silex prompt for login with directus](https://github.com/silexlabs/Silex/assets/715377/358bdf58-e5fb-4245-9130-856ad34ae7df)
Login to Silex with directus credentials: ![Login to Silex with directus credentials](https://github.com/silexlabs/Silex/assets/715377/5f58e396-0b66-4b47-adc6-165561a2c056)
User website is saved in a directus collection: ![User website is saved in a directus collection](https://github.com/silexlabs/Silex/assets/715377/5831ae1a-ad66-4939-bd89-9c4930019776)

## **Setup**

1. **Installation**: 
   Install the Directus connector for Silex.
   ```
   npm install @silexlabs/silex-directus-storage
   ```

2. **Configuration**:
   In your Silex configuration file, require and configure the Directus connector as shown below:

   ```javascript
   const DirectusStorage = require('@silexlabs/silex-directus-storage')

   module.exports = (config, opts) => {
     const directusUrl = process.env.DIRECTUS_SERVER_TO_SERVER_URL || process.env.DIRECTUS_URL

     config.addStorageConnector(new DirectusStorage(config, {
       collection: 'silex',
       assetsLocalFolder: process.env.SILEX_ASSETS_LOCAL_FOLDER,
       useHistory: false,
       directusUrl,
     }))
   }
   ```

3. **Environment Variables**:
   Ensure that the following environment variables are set:
   - `DIRECTUS_SERVER_TO_SERVER_URL` or `DIRECTUS_URL`: The URL of your Directus instance.
   - `SILEX_ASSETS_LOCAL_FOLDER` (optional): The local folder where assets are stored.

## **Usage**

Once set up, the connector will allow Silex to interact with Directus for storing and managing websites. The connector uses the specified Directus collection (default is 'silex') and can optionally use a local folder for assets.

For more details on configuring Silex, refer to the [official Silex documentation](https://docs.silex.me/en/dev/config).
