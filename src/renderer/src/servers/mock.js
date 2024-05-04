const { ipcRenderer } = window.electron

// 设置生效的mock列表
export const putMockListReq = (params) => ipcRenderer.invoke('ipc/mock/putMockList', params)
