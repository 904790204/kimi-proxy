import { useParams } from 'react-router-dom'
import { Tabs, Empty } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import Log from './log'
import Storage from './storage'
import Requests from './requests'
import Info from './info'
import { useMemo } from 'react'

const DebugDetails = () => {
  const {
    debugStore: { debugInfo }
  } = useStore()
  const params = useParams()
  const { pageId } = params
  const pageData = useMemo(() => {
    const currentPage = debugInfo[pageId]
    return JSON.parse(JSON.stringify(currentPage))
  })
  const items = [
    {
      key: '1',
      label: '日志',
      children: <Log pageData={pageData} />
    },
    {
      key: '2',
      label: '元素',
      children: 'Content of Tab Pane 2'
    },
    {
      key: '3',
      label: '网络',
      children: <Requests pageData={pageData} />
    },
    {
      key: '4',
      label: '存储',
      children: <Storage pageData={pageData} />
    },
    {
      key: '5',
      label: '信息',
      children: <Info pageData={pageData} />
    }
  ]
  if (!pageData) {
    return (
      <Empty
        style={{ paddingTop: '200px' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="当前页面已离开或不存在"
      />
    )
  }
  return <Tabs style={{ padding: '0 20px' }} defaultActiveKey="1" items={items} />
}

export default observer(DebugDetails)
