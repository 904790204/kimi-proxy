import { Menu } from 'electron'

var template = [
  {
    label: 'kimi',
    submenu: [
      {
        label: '当前版本'
      },
      { type: 'separator' },
      {
        label: '检查更新'
      },
      { type: 'separator' },
      {
        label: '退出应用'
      }
    ]
  },
  {
    label: '编辑',
    submenu: [{ role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }]
  },
  {
    label: '代理',
    submenu: [
      {
        label: 'https证书'
      },
      { type: 'separator' },
      {
        label: '代理服务',
        submenu: [
          { label: '全局代理', type: 'radio' },
          { label: '局部代理', type: 'radio' },
          { label: '关闭代理', type: 'radio' }
        ]
      },
      { type: 'separator' },
      {
        label: '节流模式',
        submenu: [
          { label: '100%', type: 'radio', checked: true },
          { label: '80%', type: 'radio' },
          { label: '50%', type: 'radio' },
          { label: '20%', type: 'radio' },
          { label: '离线', type: 'radio' }
        ]
      },
      { type: 'separator' },
      {
        label: '允许跨域',
        type: 'checkbox'
      }
    ]
  },
  {
    label: '配置',
    submenu: [
      {
        label: '导入全部配置'
      },
      {
        label: '导出全部配置'
      }
    ]
  },
  {
    label: '账号',
    submenu: [
      {
        label: '账号名称',
        type: 'normal'
      },
      {
        label: '试用期剩余3天',
        type: 'normal'
      },
      { type: 'separator' },
      {
        label: '切换账号'
      },
      {
        label: '退出账号'
      }
    ]
  }
]

export default () => {
  const m = Menu.buildFromTemplate(template) //按照模板构建菜单
  Menu.setApplicationMenu(m) //使菜单处于可用状态
}
