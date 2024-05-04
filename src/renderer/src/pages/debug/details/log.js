import { Console } from 'console-feed'
import { useMemo } from 'react'
import { Empty } from 'antd'

const DebugLog = ({ pageData = {} }) => {
  const { logs } = pageData
  const result = useMemo(() => {
    const arr = JSON.parse(JSON.stringify(logs))
    return arr.map((item) => {
      const { subclass, data, method, src = '', message, stack } = item
      if (subclass === 'console') {
        return {
          data,
          method
        }
      }
      if (subclass === 'resourceError') {
        return {
          data: [src],
          method: 'error'
        }
      }
      if (subclass === 'jsError') {
        return {
          data: [message, stack],
          method: 'error'
        }
      }
    })
  }, [logs])
  if (!result.length) {
    return (
      <Empty
        style={{ paddingTop: '200px' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无数据"
      />
    )
  }
  return <Console logs={result} />
}

export default DebugLog
