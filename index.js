const { createDirectus, rest, authentication, readMe, readItems, updateItem, deleteItems, uploadFiles, readFiles, createItem } = require('@directus/sdk')
const { default: fetch } = require('node-fetch')
const { readFile } = require('fs/promises')
const FormData = require('form-data');

/**
 * Directus connector
 * @fileoverview Directus connector for Silex, connect to the user's Directus account to store websites
 */

const svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1200.000000pt" height="1200.000000pt" viewBox="0 0 1200.000000 1200.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,1200.000000) scale(0.100000,-0.100000)"
fill="#2B1B63" stroke="none">
<path d="M0 6000 l0 -6000 6000 0 6000 0 0 6000 0 6000 -6000 0 -6000 0 0
-6000z m6485 2720 c497 -34 1010 -143 1464 -312 618 -230 1135 -547 1627 -998
164 -151 397 -401 402 -432 6 -34 -45 -148 -97 -219 -79 -106 -213 -196 -383
-256 -101 -35 -188 -50 -363 -63 -82 -6 -186 -18 -230 -26 -235 -46 -344 -201
-374 -536 -12 -135 -17 -500 -7 -517 11 -18 94 -56 161 -74 33 -9 139 -32 235
-52 369 -77 577 -139 777 -235 357 -170 596 -403 754 -734 47 -99 50 -110 38
-133 -54 -101 -175 -175 -296 -181 -152 -8 -277 58 -396 210 -148 191 -362
291 -617 290 -125 0 -208 -17 -430 -84 -91 -27 -201 -58 -245 -68 -241 -57
-496 -48 -725 25 -311 99 -591 334 -742 623 -49 93 -98 220 -98 253 0 11 -5
17 -10 14 -13 -8 -5 -142 15 -252 31 -166 115 -369 209 -503 25 -35 43 -66 41
-69 -9 -8 -135 22 -260 64 -181 59 -329 127 -790 359 -575 291 -744 353 -990
363 l-131 5 -22 116 c-26 133 -72 253 -136 355 -51 80 -103 145 -90 112 101
-256 117 -452 51 -610 -55 -133 -172 -264 -328 -367 -207 -137 -400 -203 -794
-273 -288 -51 -350 -63 -445 -92 -207 -62 -281 -116 -445 -324 -272 -345 -325
-408 -424 -511 -220 -229 -396 -326 -572 -316 -99 6 -169 39 -257 123 l-65 61
158 165 c427 443 516 587 679 1097 54 168 85 233 135 285 53 56 116 85 228
102 197 32 333 89 435 183 116 107 174 226 234 481 118 501 205 737 316 853
29 30 79 72 111 93 31 21 56 40 53 42 -2 2 -31 -1 -66 -6 -79 -13 -141 -49
-188 -111 -20 -27 -40 -49 -43 -49 -15 -2 -127 94 -167 142 -90 109 -132 229
-132 378 0 147 45 273 139 388 33 41 144 131 161 131 4 0 29 -28 56 -62 231
-295 503 -457 890 -532 129 -24 207 -35 599 -81 443 -53 727 -115 1115 -245
368 -123 487 -150 659 -150 186 0 294 43 417 165 63 62 90 100 126 170 70 137
92 213 168 560 26 120 75 281 105 349 7 16 1 14 -29 -9 -181 -138 -474 -271
-706 -320 -551 -118 -1111 2 -1558 334 -42 32 -101 80 -131 107 l-54 50 172
72 173 71 58 -40 c120 -81 339 -159 495 -174 l70 -7 -103 61 c-57 33 -140 86
-185 118 -96 69 -277 240 -357 338 -66 82 -170 235 -170 251 0 16 310 57 505
67 148 8 483 6 620 -3z"/>
</g>
</svg>`
const encodedSvg = encodeURIComponent(svg)
const ICON = `data:image/svg+xml,${encodedSvg}`

module.exports = class DirectusConnector {
  connectorId = 'directus'
  connectorType = 'STORAGE'
  displayName = 'Directus'
  icon = ICON
  disableLogout = false
  color = '#FFFFFF'
  background = '#2B1B63'
  options = {}

  constructor(config, opts) {
    this.options = {
      collection: 'silex',
      assetsLocalFolder: null,
      useHistory: true,
      ...opts,
    }
  }

  // Get the SDK client
  getClient(session) {
    return createDirectus(session.directus.host).with(rest()).with(authentication('json'))
  }

  // Get the URL to start the authentication process with OAuth (not used for basic auth)
  //getOAuthUrl(session: Session): Promise<string | null>
  async getOAuthUrl(session) { return null }

  // Get the form to display to the user to authenticate (not used for OAuth)
  //getLoginForm(session: Session, redirectTo: string): Promise<string | null>
  async getLoginForm(session, redirectTo) {
    return `
    <style>
      body {
        background: #2B1B63;
        color: #FFFFFF;
        font-family: sans-serif;
      }
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
      input {
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #FFFFFF;
        background: transparent;
        color: #FFFFFF;
        font-size: 16px;
        width: 300px;
      }
      button {
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        border: 1px solid #FFFFFF;
        background: transparent;
        color: #FFFFFF;
        font-size: 16px;
        width: 300px;
        cursor: pointer;
      }
      button:hover {
        background: #FFFFFF;
        color: #2B1B63;
      }
    </style>
    <form action="${redirectTo}" method="POST">
      <h1>Directus Login</h1>
      <input type="url" name="host" placeholder="Host" />
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    `
  }

  // Get the form to display to the user to set the connector settings for a given website
  // getSettingsForm(session: Session, redirectTo: string): Promise<string | null>
  async getSettingsForm(session, redirectTo) { return null }

  // Auth and user management
  // isLoggedIn(session: Session): Promise<boolean>
  async isLoggedIn(session) { 
    return !!session.directus
  }

  //setToken(session: Session, token: object): Promise<void>
  async setToken(session, token) {
    session.directus = this.getOptions(token)
  }

  //logout(session: Session): Promise<void>
  async logout(session) {
    delete session.directus
  }

  //getUser(session: Session): Promise<ConnectorUser | null>
  async getUser(session) {
    if(!this.isLoggedIn(session)) {
      const err = new Error('Not logged in')
      err.httpStatusCode = 401
      throw err
    }
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      const user = await client.request(readMe())

      return {
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        picture: user.avatar,
        storage: {
          connectorId: this.connectorId,
          type: this.connectorType,
          displayName: this.displayName,
          icon: this.icon,
          disableLogout: this.disableLogout,
          isLoggedIn: true,
          oauthUrl: null,
          color: this.color,
          background: this.background,
        },
      }
    } catch (e) {
      console.error('Error getting directus user', e)
      const err = new Error(`Error getting directus user: ${e.message}`)
      err.httpStatusCode = 401
      throw err
    }
  }

  // Get the connector options from login form
  // They are stored in the website meta file for hosting connectors
  // And in the user session for storage connectors
  //getOptions(formData: object): ConnectorOptions
  getOptions(formData) {
    return {
      host: formData.host.replace(/\/$/, ''),
      username: formData.username,
      password: formData.password,
    }
  }
  //// CRUD on websites
  //listWebsites(session: Session): Promise<WebsiteMeta[]>
  async listWebsites(session) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      // one instance of each website_id
      const websites = await client.request(readItems(this.options.collection, { groupBy: ['website_id'], aggregate: { count: 'website_id'} }))
      // Await all the websites
      return Promise.all(websites.map(async website => await this.getWebsiteMeta(session, website.website_id)))
    } catch (e) {
      console.error('Error listing directus websites', e)
      throw e
    }
  }
  //readWebsite(session: Session, websiteId: WebsiteId): Promise<WebsiteData | Readable>
  async readWebsite(session, websiteId) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      const websites = await client.request(readItems(this.options.collection, { filter: { website_id: websiteId }, sort: ['-id'], limit: 1 }))
      if(!websites || !websites.length) {
        const err = new Error('Website not found')
        err.httpStatusCode = 404
        throw err
      }
      const website = websites[0]
      return {
        pages: website.pages,
        assets: website.assets,
        styles: website.styles,
        settings: website.settings,
        fonts: website.fonts,
        symbols: website.symbols,
        publication: website.publication,
      }
    } catch (e) {
      console.error('Error getting directus website', e)
      throw e
    }
  }
  //createWebsite(session: Session, data: WebsiteMetaFileContent): Promise<WebsiteId>
  async createWebsite(session, data) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      const website = await client.request(createItem(this.options.collection, data))
      return website.website_id
    } catch (e) {
      console.error('Error creating directus website', e)
      throw e
    }
  }

  //updateWebsite(session: Session, websiteId: WebsiteId, data: WebsiteData): Promise<void>
  async updateWebsite(session, websiteId, data) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      // Get the website id
      const websites = await client.request(readItems(this.options.collection, { filter: { website_id: websiteId }, sort: ['-id'], limit: 1, fields: ['id'] }))
      if(!websites || !websites.length) {
        const err = new Error('Website not found')
        err.httpStatusCode = 404
        throw err
      }
      const id = websites[0].id
      const website = await client.request(
        this.options.useHistory
        ? updateItem(this.options.collection, id, data)
        : createItem(this.options.collection, {
          ...data,
          website_id: websiteId,
        })
      )
      //const fields = Object.keys(data)
      //const website = await client.request(updateItem(this.options.collection, { filter: { website_id: websiteId }, sort: ['-id'], limit: 1, fields }, data))
      return website.website_id
    } catch (e) {
      console.error('Error updating directus website', JSON.stringify(e.errors))
      throw e
    }
  }

  //deleteWebsite(session: Session, websiteId: WebsiteId): Promise<void>
  async deleteWebsite(session, websiteId) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      await client.request(deleteItems(this.options.collection, { filter: { website_id: websiteId }, sort: ['-id'], limit: 1 }))
    } catch (e) {
      console.error('Error deleting directus website', e)
      throw e
    }
  }

  async writeAssets(session, websiteId, files, status) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    if(files.length !== 1) throw new Error('Only one file at a time is supported')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      const file = files[0]
      const data = new FormData();
      data.append('file', file.content, file.path.replace(/^\//, ''));
      const url = `${session.directus.host}/files`
      const response = await fetch(url, {
        "credentials": "include",
        "headers": {
          "Accept": "application/json",
          "Authorization": `Bearer ${await client.getToken()}`,
          ...data.getHeaders(),
        },
        body: data,
        "method": "POST",
        "mode": "cors"
      });
      if (response.ok) {
        const json = await response.json()
        return [json.data.filename_disk]
      } else {
        const err = new Error(`Error writing directus assets: ${response.statusText}`)
        err.httpStatusCode = response.status
        throw err
      }
    } catch (e) {
      console.error('Error writing directus assets', e)
      throw e
    }
  }
  //readAsset(session: Session, websiteId: WebsiteId, fileName: string): Promise<ConnectorFileContent>
  async readAsset(session, websiteId, fileName) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      if(this.options.assetsLocalFolder) {
        const filePath = path.join(this.options.assetsLocalFolder, fileName.replace(/^\//, ''))
        // Returns a readable stream with the local file content
        return readFile(filePath)
      } else {
        const client = this.getClient(session)
        await client.login(session.directus.username, session.directus.password)
        const url = `${session.directus.host}/assets/${fileName.replace(/^\//, '')}?download`
        const response = await fetch(url, { headers: { Authorization: `Bearer ${await client.getToken()}` } })
        if(response.ok) {
          const buf = await response.buffer()
          return buf
        } else {
          const err = new Error(`Error reading directus asset: ${response.statusText}`)
          err.httpStatusCode = response.status
          throw err
        }
      }
    } catch (e) {
      console.error('Error reading directus asset', e)
      throw e
    }
  }

  //deleteAssets(session: Session, websiteId: WebsiteId, fileNames: string[]): Promise<void>
  async deleteAssets(session, websiteId, fileNames) {
    throw new Error('Not implemented')
  }

  ////getFileUrl(session: Session, websiteId: WebsiteId, path: string): Promise<string>
  async getFileUrl(session, websiteId, path) {
    throw new Error('Not implemented')
  }

  //// Handle website meta file
  //getWebsiteMeta(session: Session, websiteId: WebsiteId): Promise<WebsiteMeta>
  async getWebsiteMeta(session, websiteId) {
    if(!this.isLoggedIn(session)) throw new Error('Not logged in')
    try {
      const client = this.getClient(session)
      await client.login(session.directus.username, session.directus.password)
      const fields = ['name', 'image_url', 'website_id', 'created_on', 'modified_on']
      const websites = await client.request(readItems(this.options.collection, { filter: { website_id: websiteId }, sort: ['-id'], limit: 1 }, fields))
      if(!websites || !websites.length) {
        const err = new Error('Website not found')
        err.httpStatusCode = 404
        throw err
      }
      const website = websites[0]
      return {
        //name: string
        //imageUrl?: string
        //connectorUserSettings: ConnectorUserSettings
        //websiteId: WebsiteId
        //createdAt: Date
        //updatedAt: Date
        name: website.name,
        imageUrl: website.image_url,
        websiteId: website.website_id,
        createdAt: website.created_on,
        updatedAt: website.modified_on,
        connectorUserSettings: {},
      }
    } catch (e) {
      console.error('Error getting directus website', e)
      throw e
    }
  }
  //setWebsiteMeta(session: Session, websiteId: WebsiteId, data: WebsiteMetaFileContent): Promise<void>
}
