# Directus plugin for Silex website builder

> This code is part of a bigger project: [Silex v3](https://www.silex.me/) which aims to be a free/libre alternative to webflow
>
> For bugs and support please [start a discussion here](https://community.silex.me)

This plugin is a connector to integrate Silex with Directus, enabling users to store their websites and assets in their Directus account.

Silex prompt for login with directus:

![Silex prompt for login with directus](https://github.com/silexlabs/Silex/assets/715377/358bdf58-e5fb-4245-9130-856ad34ae7df)

Login to Silex with directus credentials:

![Login to Silex with directus credentials](https://github.com/silexlabs/Silex/assets/715377/5f58e396-0b66-4b47-adc6-165561a2c056)

User website is saved in a directus collection:

![User website is saved in a directus collection](https://github.com/silexlabs/Silex/assets/715377/5831ae1a-ad66-4939-bd89-9c4930019776)

> Note that the login screen will include a `host` filed if you do not set the `directusUrl` in the options

## **Setup**

1. **Installation**: 
   Install the Directus connector for Silex.
   ```
   npm install @silexlabs/silex-directus-storage
   ```

2. **Configuration**:-
   In your Silex configuration file, require and configure the Directus connector as shown below:

   ```javascript
   // In config.js
   const DirectusStorage = require('@silexlabs/silex-directus-storage')
   module.exports = (config, opts) => {
     config.addStorageConnector(new DirectusStorage(config, {
       collection: 'silex',
       useHistory: false,
       directusUrl: 'http://localhost:8085',
     }))
   }
   ```

  For more details on configuring Silex, refer to the [official Silex documentation](https://docs.silex.me/en/dev/config).

3. **Start Silex**:
  ```
  silex --config='path/to/config.js`
  ```

4. **Open Silex and use it with Directus**
  Go to http://localhost:6805 and click "login with Directus"


Certainly! Here's a refined version:

## **Configuration Options for Directus Connector**

These options allow you to tailor the Directus connector to best fit your workflow with Silex.

1. **`collection`**: 
   - **Description**: Specifies the collection name within Directus where Silex websites will be stored.
   - **Default**: `silex`

2. **`useHistory`**: 
   - **Description**: Determines how Silex saves website versions.
   - **Default**: `true`.
     - When `true`: Silex saves the website within the same item, enabling the use of the "Revisions panel". This allows for easy reversion to previous versions.
     - When `false`: Each "save" in Silex creates a new item. This approach offers a clear view of all versions and facilitates their individual editing or deletion. However, reverting to a previous version requires deleting newer revisions, unlike the straightforward revert process with the revisions panel.

3. **`directusUrl`**: 
   - **Description**: Defines the URL of the Directus instance.
   - **Default**: None. If not provided, the user will be prompted to enter one.
