const { ipcRenderer } = window.electron

// 设置生效的rewrite列表
export const putRewriteReq = (params) => ipcRenderer.invoke('ipc/rewrite/putRewriteList', params)
