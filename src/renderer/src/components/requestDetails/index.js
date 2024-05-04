import { Drawer, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import Payload from './payload'
import Header from './header'
import Cookie from './cookie'
import Response from './response'

const Detail = (props) => {
  const { visible, onClose, details } = props
  const [tabsKey, setTabsKey] = useState(1)
  useEffect(() => {
    if (visible) {
      setTabsKey(1)
    }
  }, [visible])

  const tabs = [
    {
      key: 1,
      label: 'Header',
      children: <Header details={details} />
    },
    {
      key: 2,
      label: 'Payload',
      children: <Payload details={details} />
    },
    {
      key: 3,
      label: 'Response',
      children: <Response details={details} />
    },
    {
      key: 4,
      label: 'Cookie',
      children: <Cookie details={details} />
    }
  ]
  return (
    <Drawer
      title="详情"
      placement="right"
      onClose={onClose}
      open={visible}
      width="800px"
      bodyStyle={{ padding: '0 10px 0 24px' }}
    >
      <Tabs activeKey={tabsKey} items={tabs} onChange={setTabsKey} />
    </Drawer>
  )
}

export default Detail
