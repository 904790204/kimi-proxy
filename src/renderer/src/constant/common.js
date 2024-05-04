import {
  NodeExpandOutlined,
  GlobalOutlined,
  FileTextOutlined,
  SettingOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons'

// 代理模式
export const PROXYMODE_OPTIONS = [
  { label: '全局模式', value: 1 },
  { label: '局部模式', value: 2 }
]

// 默认代理端口号
export const PROXY_PORT = 8899

// 默认路由标识
export const HOMEPAGE_VALUE = 'intercept'

// 菜单
export const MENU_PAGES = [
  {
    label: '网络拦截',
    to: '/intercept',
    icon: <GlobalOutlined />,
    value: 'intercept'
  },
  {
    label: '接口模拟',
    to: '/mock',
    icon: <FileMarkdownOutlined />,
    value: 'mock'
  },
  {
    label: '地址转发',
    to: '/rewrite',
    icon: <NodeExpandOutlined />,
    value: 'rewrite'
  },
  {
    label: '页面调试',
    to: '/debug',
    icon: <FileTextOutlined />,
    value: 'debug'
  },
  {
    label: '应用设置',
    to: '/setting',
    icon: <SettingOutlined />,
    value: 'setting'
  }
]

export const NETWORK_DELAY = {
  fast: 0,
  middle: 1,
  slow: 2
}

export const NETWORK_DELAYTEXT = {
  0: '快',
  1: '中',
  2: '慢'
}
