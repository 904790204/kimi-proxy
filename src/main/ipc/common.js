import { ipcMain } from 'electron'
import { serverStart, serverEnd, setProxyMode, serverReset } from '../servers'
import intercept from '../servers/core/intercept'
import { getIPAdress } from '../electron/utils'
import pkg from '../../../package.json'
import { isRootCATrusted } from '../utils/certificate'

export default () => {
  //获取应用信息
  ipcMain.handle('ipc/common/setProxyMode', async (event, args) => {
    setProxyMode(args)
    return {
      isSuccess: true
    }
  })
  // 重启代理服务
  ipcMain.handle('ipc/common/setProxyPort', async (event, args) => {
    serverReset(args)
    return {
      isSuccess: true
    }
  })
  // 切换电脑端代理开关
  ipcMain.handle('ipc/common/switchProxy', async (event, args) => {
    const { status } = args
    if (status) {
      await serverStart()
    } else {
      await serverEnd()
    }
    return {
      isSuccess: true,
      data: {
        status
      }
    }
  })
  //用户最新精准匹配域名
  ipcMain.handle('ipc/common/putMatchHost', async (event, args) => {
    const { list } = args
    intercept.updataMatchHost(list)
    return {
      isSuccess: true
    }
  })

  //获取应用信息
  ipcMain.handle('ipc/common/getAppInfo', async () => {
    const ipInfo = getIPAdress()
    const caStatus = await isRootCATrusted()
    const data = {
      ...ipInfo,
      version: pkg.version,
      caStatus,
      ...process.versions
    }
    return {
      data,
      isSuccess: true
    }
  })

  // 设置代理服务延迟
  ipcMain.handle('ipc/common/setProxyDelay', async (event, args) => {
    intercept.updataServerDelay(args)
  })
}
