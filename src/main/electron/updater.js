import { autoUpdater } from 'electron-updater'
import message from './sendMessage'

// autoUpdater.logger = log
// 关掉自动下载，如果需要也可以打开，我这里不需要
autoUpdater.autoDownload = false // 手动指定下载
// autoUpdater.setFeedURL('http://localhost:8080/')
autoUpdater.setFeedURL('http://takim.cn/proxy/') // 更新包的地址，如 https://xxx.com/app/

// 开始检查是否有更新
autoUpdater.on('checking-for-update', function () {
  console.log('checking-for-update')
})
// 有更新时触发
autoUpdater.on('update-available', function (info) {
  console.log('updateAvailable')
  message.sendUpdaterConfirm(info)
})
// 不需要更新
autoUpdater.on('update-not-available', function (info) {
  console.log('updateNotAvailable')
  message.sendNotUpdater(info)
})

// 更新下载进度事件
autoUpdater.on('download-progress', function (progressObj) {
  console.log('下载进度百分比>>>', progressObj.percent)
  message.sendUpdaterProgress(progressObj.percent)
})
// 下载完成
autoUpdater.on('update-downloaded', () => {
  console.log('downloaded')
  // 退出且重新安装
  message.sendUpdaterComplete()
})

// 更新报错
autoUpdater.on('error', (error) => {
  message.sendUpdaterError(error)
})

// 检查更新
export const checkForUpdates = () => {
  console.log('checkForUpdates')
  autoUpdater.checkForUpdatesAndNotify()
  // autoUpdater.checkForUpdates()
}
// 下载安装包
export const downloadUpdate = (msg = {}) => {
  // 没有签名，下载后也不能安装
  autoUpdater.downloadUpdate()
}
// 退出并安装
export const quitAndInstall = () => {
  console.log('quitAndInstall')
  autoUpdater.quitAndInstall()
}
