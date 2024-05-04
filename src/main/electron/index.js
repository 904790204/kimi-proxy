import { BrowserWindow, shell, screen } from 'electron'
// import { initMessage } from './message'
import { generateRootCertificate } from '../utils/certificate'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
// import initMenu from './menu'
import initIpc from '../ipc'

// export const createWindow = async () => {
//   global.win = new BrowserWindow({
//     width: 1200,
//     height: 700,
//     webPreferences: {

//       // Use pluginOptions.nodeIntegration, leave this alone
//       // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
//       nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
//       contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
//     }
//   })

//   if (process.env.WEBPACK_DEV_SERVER_URL) {
//     // Load the url of the dev server if in development mode
//     await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
//     if (!process.env.IS_TEST) win.webContents.openDevTools()
//   } else {
//     createProtocol('app')
//     // Load the index.html when not in development
//     win.loadURL('app://./index.html')
//     win.webContents.openDevTools()
//   }
// }

export const init = () => {
  // initMessage()
  initIpc()
  generateRootCertificate()
  // initMenu()
}

export const createWindow = () => {
  const dWidth = screen.getPrimaryDisplay().workAreaSize.width
  const dHeight = screen.getPrimaryDisplay().workAreaSize.height
  // Create the browser window.
  global.mainWindow = new BrowserWindow({
    width: dWidth > 1200 ? 1200 : dWidth,
    height: dHeight > 800 ? 800 : dHeight,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  // if (process.platform === "darwin") {
  //   let contents = mainWindow.webContents;
  //   globalShortcut.register("CommandOrControl+C", () => {
  //     contents.copy();
  //   });
  //   globalShortcut.register("CommandOrControl+V", () => {
  //     contents.paste();
  //   });
  // }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // const template = [
  //   {
  //     label: 'Edit',
  //     submenu: [{ role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'about' }]
  //   }
  // ]
  // Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
