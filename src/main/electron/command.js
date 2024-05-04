
import { execSync } from 'child_process'

// 开启/关闭系统代理
export const switchWebProxy = (status, port) => {
  if (status) {
    execSync(`networksetup -setwebproxy Wi-Fi 127.0.0.1 ${port}`)
    execSync(`networksetup -setsecurewebproxy Wi-Fi 127.0.0.1 ${port}`)
  } else {
    execSync('networksetup -setwebproxystate Wi-Fi off')
    execSync('networksetup -setsecurewebproxystate Wi-Fi off')
  }
}
