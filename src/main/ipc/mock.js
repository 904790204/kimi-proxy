import { ipcMain } from 'electron'
import intercept from '../servers/core/intercept'

export default () => {
  //用户最新精准匹配域名
  ipcMain.handle('ipc/mock/putMockList', async (event, args) => {
    const { list } = args
    intercept.updataMocks(list)
    return {
      isSuccess: true
    }
  })
}
