import { useMemo } from 'react'
import { Empty } from 'antd'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@src/stores'
import TextInfo from '@src/components/textInfo'
import styles from './index.less'

const List = () => {
  const {
    debugStore: { debugInfo }
  } = useStore()

  const navigate = useNavigate()

  const handleDetails = ({ id }) => {
    navigate(`/debug/${id}`)
  }

  const list = useMemo(
    () =>
      Object.keys(debugInfo)
        .map((key) => ({
          id: key,
          ...debugInfo[key]
        }))
        .sort((item) => {
          if (item.visibility) {
            return -1
          }
          return 1
        }),
    [debugInfo]
  )
  return (
    <div className={styles.pageList}>
      {!list.length && (
        <Empty
          style={{ paddingTop: '200px' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无数据"
        />
      )}
      {list.map((item) => {
        const { id, info = {}, visibility } = item
        const { system, appCodeName, href } = info
        // if (!visibility) return null
        const option = {
          title: null,
          num: 4,
          id,
          children: [
            {
              label: '系统',
              value: system
            },
            {
              label: '浏览器',
              value: appCodeName
            },
            {
              label: '页面id',
              value: id,
              span: 2
            },
            {
              label: '页面状态',
              value: visibility ? '连接' : '断开',
              contentStyle: visibility ? { color: '#52c41a' } : { color: '#faad14' }
            },
            {
              label: '地址',
              value: href,
              span: 3
            }
          ]
        }
        return (
          <TextInfo
            onClick={handleDetails}
            key={id}
            className={styles.pageListItem}
            options={option}
          />
        )
      })}
    </div>
  )
}

export default observer(List)
