import { ipcMain } from 'electron'
import { switchWebProxy } from './command'
import { serverStart, serverEnd } from '../servers'
import intercept from '../servers/core/intercept'
import { openCaWin, setRootCA } from '../utils/certificate'
import { downloadUpdate, quitAndInstall, checkForUpdates } from './updater'
import { getIPAdress } from './utils'
import pkg from '../../../package.json'

// 绑定通信事件
const bindMessage = (url, fn) => {
  // 调用bindMessage，绑定一个新事件
  // event ipc通信对象，params 渲染进程的参数
  ipcMain.on(url, (event, params) => {
    // fn为一个异步回调，用来处理访问接口时的数据返回
    fn(params, {
      success: (data = {}) => {
        // 成功返回
        event.reply(`${url}-reply`, {
          isSuccess: true,
          data
        })
      },
      error: (error = {}) => {
        // 失败返回
        event.reply(`${url}-reply`, {
          isSuccess: false,
          error
        })
      }
    })
  })
}

// 监听渲染进程发来的信息
export const initMessage = () => {
  // 获取本地网络信息
  bindMessage('fetchLocalNetInfo', async (params, res) => {
    res.success({ ...getIPAdress(), port: global.port })
  })

  // 切换电脑端代理开关
  ipcMain.handle('fetchSwitchProxy', async (event, args) => {
    const { status } = args
    console.log(status)
    switchWebProxy(status)
    if (status) {
      await serverStart('desktop')
    } else {
      await serverEnd('desktop')
    }
    return {
      isSuccess: true,
      data: {
        status
      }
    }
  })
  // bindMessage('fetchSwitchProxy', async (params, res) => {
  //   const { status } = params
  //   switchWebProxy(status)
  //   try {
  //     if (status) {
  //       await serverStart('desktop')
  //     } else {
  //       await serverEnd('desktop')
  //     }
  //     res.success()
  //   } catch (error) {
  //     res.error(error)
  //   }
  // })

  // 切换移动端端代理开关
  bindMessage('fetchSwitchMobileProxy', async (params, res) => {
    const { status } = params
    // switchWebProxy(status)
    try {
      if (status) {
        await serverStart('mobile')
      } else {
        await serverEnd('mobile')
      }
      res.success()
    } catch (error) {
      res.error(error)
    }
  })

  // 更新转发配置
  bindMessage('fetchUpdataRewrite', async (params, res) => {
    const { list } = params
    intercept.updataRewrites(list)
    res.success()
  })

  // 更新mock配置
  bindMessage('fetchUpdataMock', async (params, res) => {
    const { mocks } = params
    intercept.updataMocks(mocks)
    res.success()
  })

  // 设置安全证书
  bindMessage('fetchSetRootCA', async (_, res) => {
    setRootCA()
    res.success()
  })

  // 手动设置安全证书
  bindMessage('fetchOpenRootCA', async (_, res) => {
    openCaWin()
    res.success()
  })

  // 判断是否有更新
  bindMessage('fetchCheckForUpdates', async (_, res) => {
    checkForUpdates()
    res.success()
  })

  // 判断是否有更新
  bindMessage('fetchDownloadPackage', async (data, res) => {
    downloadUpdate(data)
    res.success()
  })

  // 判断是否有更新
  bindMessage('fetchQuitAndInstall', async (data, res) => {
    quitAndInstall(data)
    res.success()
  })

  // 获取当前版本号
  bindMessage('fetchCurrentVersion', async (data, res) => {
    res.success({ app: pkg.version, ...process.versions })
  })
}
