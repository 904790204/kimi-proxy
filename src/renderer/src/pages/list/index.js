import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import List from '@src/components/requestList'
import Filter from './filter'
import styles from './index.less'

const Intercept = () => {
  const {
    interceptStore: { list = [] }
  } = useStore()
  return (
    <div className={styles.intercept}>
      <Filter />
      <List list={list} />
    </div>
  )
}

export default observer(Intercept)
