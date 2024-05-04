import { useEffect } from 'react'
import QRCode from 'qrcode'
import { Descriptions } from 'antd'
import styles from './index.less'

const Phone = (props) => {
  const { config, info } = props
  const { en0 } = info
  const { port } = config
  useEffect(() => {
    const canvas = document.getElementById('canvas')
    QRCode.toCanvas(
      'http://kimiproxy.takim.cn/local/download/certificate',
      {
        width: 80,
        margin: 0
      },
      (err, code) => {
        canvas.appendChild(code)
      }
    )
  }, [])
  return (
    <div className={styles.phoneStep}>
      <div>
        <p>1、打开代理开关（如不需要电脑代理可选择局部模式），将电脑和手机链接到同一WIFI下</p>
        <p>
          2、打开手机网络设置，选择手动代理，请输入以下信息 ip: <span>{en0}</span> 端口:{' '}
          <span>{port}</span>
        </p>
        <p>3、手机扫码，下载安装证书，如已信任证书则忽略此步（需先设置代理才能访问到证书）</p>
      </div>
      <div className={styles.qrCode} id="canvas"></div>
    </div>
  )
}

export default Phone
