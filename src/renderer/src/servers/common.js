const { ipcRenderer } = window.electron

// // 切换电脑端代理开关
export const fetchSwitchProxy = (params) => ipcRenderer.invoke('ipc/common/switchProxy', params)

// // 设置精准匹配hostname
export const putMatchHost = (params) => ipcRenderer.invoke('ipc/common/putMatchHost', params)

// 获取应用信息
export const fetchAppInfo = () => ipcRenderer.invoke('ipc/common/getAppInfo')

// 设置代理模式
export const putProxyMode = (val) => ipcRenderer.invoke('ipc/common/setProxyMode', val)

// 修改代理端口号
export const putProxyPort = (val) => ipcRenderer.invoke('ipc/common/setProxyPort', val)

// 设置代理服务延迟
export const putProxyDelay = (val) => ipcRenderer.invoke('ipc/common/setProxyDelay', val)
