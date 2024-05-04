import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import styles from './index.less'
import Network from './network'
import Phone from './phone'
import Setting from './setting'

const Home = () => {
  const {
    commonStore: { allConfig, appInfo }
  } = useStore()
  return (
    <div className={styles.home}>
      <div className={styles.online}>
        <div className={styles.title}>网络</div>
        <Network config={allConfig} info={appInfo} />
      </div>
      <div className={styles.setting}>
        <div className={styles.title}>设置</div>
        <Setting config={allConfig} info={appInfo} />
      </div>
      <div className={styles.phone}>
        <div className={styles.title}>移动端代理</div>
        <Phone info={appInfo} config={allConfig} />
      </div>
    </div>
  )
}

export default observer(Home)
