import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow, init } from './electron'
import { serverEnd } from './servers'
import { switchWebProxy } from './electron/command'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  init()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 渲染进程崩溃
  app.on('renderer-process-crashed', (event, webContents, killed) => {
    log.error(
      `APP-ERROR:renderer-process-crashed; event: ${JSON.stringify(
        event
      )}; webContents:${JSON.stringify(webContents)}; killed:${JSON.stringify(killed)}`
    )
  })

  // GPU进程崩溃
  app.on('gpu-process-crashed', (event, killed) => {
    log.error(
      `APP-ERROR:gpu-process-crashed; event: ${JSON.stringify(event)}; killed: ${JSON.stringify(
        killed
      )}`
    )
  })

  // 渲染进程结束
  app.on('render-process-gone', async (event, webContents, details) => {
    log.error(
      `APP-ERROR:render-process-gone; event: ${JSON.stringify(event)}; webContents:${JSON.stringify(
        webContents
      )}; details:${JSON.stringify(details)}`
    )
  })

  // 子进程结束
  app.on('child-process-gone', async (event, details) => {
    log.error(
      `APP-ERROR:child-process-gone; event: ${JSON.stringify(event)}; details:${JSON.stringify(
        details
      )}`
    )
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  serverEnd()
  switchWebProxy(false)
})
