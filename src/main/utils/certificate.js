import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
// import CertManager from '../certificate'
import CertManager from 'node-easy-cert'
import message from '../electron/sendMessage'

const homedir = os.homedir()
const childProcess = promisify(exec)
export const mkcertFilePath = path.join(homedir, '.kim-proxy-cert/rootCA.crt')

// https://www.npmjs.com/package/node-easy-cert
// node-easy-cert文档

const options = {
  rootDirPath: path.join(homedir, '.kim-proxy-cert'),
  inMemory: false,
  defaultCertAttrs: [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'KimProxy' },
    { shortName: 'ST', value: 'SH' },
    { shortName: 'OU', value: 'KimProxy SSL Proxy' }
  ]
}

const crtMgr = new CertManager(options)
const rootOptions = {
  commonName: 'KimProxy'
}

export const { ifRootCATrusted, isRootCAFileExists, getCertificate, generateRootCA } = crtMgr

// 打开窗口手动信任证书
export const openCaWin = async () => await childProcess(`open ${mkcertFilePath}`)

// 输入密码自动信任证书
export const setRootCA = async () => {
  try {
    await childProcess(
      `security add-trusted-cert -d -k ~/Library/Keychains/login.keychain ${mkcertFilePath}`
    )
    console.log('输入密码自动信任证书成功')
    message.sendTrustCAComplete(null)
  } catch (error) {
    console.log('输入密码自动信任证书失败，手动打开窗口尝试', error)
    message.sendTrustCAComplete('输入密码自动信任证书失败，手动打开窗口尝试')
  }
}
// 判断根证书是否被信任
export const isRootCATrusted = () =>
  new Promise((reslove, reject) => {
    ifRootCATrusted((err, state) => {
      if (!err) {
        reslove(state)
      }
      reject(err)
    })
  })

// 生成ca证书
export const generateRootCertificate = () => {
  if (!isRootCAFileExists()) {
    generateRootCA(rootOptions)
  }
}

// 生成域名证书
export const getHostCertificate = (hostname) =>
  new Promise((reslove, reject) => {
    getCertificate(hostname, (error, keyContent, crtContent) => {
      // 证书未创建
      if (error === 'ROOT_CA_NOT_EXISTS') {
        reject(error)
      }
      reslove({
        key: keyContent,
        cert: crtContent
      })
    })
  })
