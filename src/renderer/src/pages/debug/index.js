import { useMemo } from 'react'
import { Breadcrumb, Tag } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
// import List from './list'
import styles from './index.less'

const Debug = () => {
  const { pageId } = useParams()

  const {
    debugStore: { debugInfo }
  } = useStore()
  const currentPage = debugInfo[pageId] || {}
  const paths = useMemo(() => {
    return [
      {
        title: <Link to="/debug">页面列表</Link>
      },
      {
        title: pageId ? <span>{pageId}</span> : null
      }
    ].filter((el) => el.title)
  }, [pageId])

  return (
    <div>
      <div className={styles.nav}>
        <Breadcrumb separator=">" items={paths} />
        {!!pageId && (
          <>
            {currentPage.visibility ? (
              <Tag color="green">连接</Tag>
            ) : (
              <Tag color="orange">断开</Tag>
            )}
          </>
        )}
      </div>
      <Outlet />
    </div>
  )
}

export default observer(Debug)
