import { useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { UserOutlined, RocketOutlined } from '@ant-design/icons'
import { Switch, Tooltip, message } from 'antd'
import cx from 'classname'
import MatchHost from '../match'
import styles from './index.less'
import { useStore } from '@src/stores'
import { PROXYMODE_OPTIONS, NETWORK_DELAY, NETWORK_DELAYTEXT } from '@src/constant/common'
import { putProxyDelay } from '@src/servers/common'

const Header = () => {
  const {
    commonStore: { proxyChecked, proxyCheckedLoading, switchProxyChecked, getMatchHosts, allConfig }
  } = useStore()
  const { mode } = allConfig
  const [delay, setDelay] = useState(NETWORK_DELAY.fast)

  const currentMode = useMemo(
    () => PROXYMODE_OPTIONS.find((el) => el.value === Number(mode)),
    [mode]
  )

  const handleDelay = () => {
    let target = delay
    if (NETWORK_DELAY.fast === delay) {
      target = NETWORK_DELAY.middle
    }
    if (NETWORK_DELAY.middle === delay) {
      target = NETWORK_DELAY.slow
    }
    if (NETWORK_DELAY.slow === delay) {
      target = NETWORK_DELAY.fast
    }
    setDelay(target)
    putProxyDelay(target)
  }

  const handleOpenProxy = (state) => {
    const text = state ? '开启' : '关闭'
    switchProxyChecked(state)
      .then(() => {
        message.success(`代理${text}成功`)
      })
      .catch(() => {
        message.error(`代理${text}失败`)
      })
  }

  useEffect(() => {
    getMatchHosts()
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.iconOperate}>
        <MatchHost />
        <Tooltip title={`节流模式：${NETWORK_DELAYTEXT[delay]}`}>
          <RocketOutlined
            className={cx(
              styles.rocketIcon,
              NETWORK_DELAY.middle === delay && styles.middle,
              NETWORK_DELAY.slow === delay && styles.slow
            )}
            onClick={handleDelay}
          />
        </Tooltip>
      </div>
      <div className={styles.proxy}>
        <span className={styles.modeName}>{currentMode.label}</span>
        <Switch
          checkedChildren="代理开启"
          unCheckedChildren="代理关闭"
          checked={proxyChecked}
          loading={proxyCheckedLoading}
          onChange={handleOpenProxy}
        />
      </div>

      {/* <div className={styles.user}>
        <UserOutlined />
      </div> */}
    </div>
  )
}

export default observer(Header)
