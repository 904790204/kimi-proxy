const { ipcRenderer } = window.electron

export const watchInterceptList = (updata) => {
  ipcRenderer.on('ipc/intercept/list', (event, arg) => {
    updata(arg)
  })
}

export const watchDebugInfo = (updata) => {
  ipcRenderer.on('ipc/debug/info', (event, arg) => {
    updata(arg)
  })
}
