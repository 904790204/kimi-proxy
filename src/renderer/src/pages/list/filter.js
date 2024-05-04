import { useEffect, useState } from 'react'
import { Tag, Input, Modal } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import { observer } from 'mobx-react-lite'
import cx from 'classname'
import styles from './index.less'
import { useStore } from '@src/stores'
import { INTERCEPT_MAX } from '@src/constant/intercept'

const { confirm } = Modal
const { CheckableTag } = Tag
const tagsData = ['all', 'json', 'js', 'css', 'img', 'html', 'other']

const Filter = () => {
  const {
    interceptStore: { clearInterceptList, setFilter, interceptList = [], list = [], hostname, type }
  } = useStore()
  // const [selectedTag, setSelectedTag] = useState(tagsData[0])
  const [numWarnStatus, setNumWarnStatus] = useState(true)
  const isFilter = !!hostname || type !== 'all'
  const isNumWarn = interceptList.length >= INTERCEPT_MAX / 2
  const isNumError = interceptList.length >= INTERCEPT_MAX
  // 切换筛选项
  const handleChange = (type) => {
    setFilter({
      type: type
    })
    // setSelectedTag(type)
  }

  // 输入框筛选
  const handleFilterChange = debounce((ev) => {
    setFilter({
      hostname: ev?.target?.value || ''
    })
  }, 300)

  // 清空列表
  const handleEmpty = () => {
    setNumWarnStatus(true)
    clearInterceptList()
  }

  useEffect(() => {
    if (isNumError && numWarnStatus) {
      setNumWarnStatus(false)
      confirm({
        title: `已拦截的网络请求数量已达最大值${INTERCEPT_MAX}条`,
        content: '当前拦截列表不再更新，请清空列表继续，或者保持当前数据继续浏览',
        okText: '清空',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          clearInterceptList()
          setNumWarnStatus(true)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }, [numWarnStatus, isNumError])
  return (
    <div className={styles.filter}>
      <Input
        placeholder="过滤host"
        size="small"
        style={{ width: '160px', marginRight: '10px' }}
        onChange={handleFilterChange}
        allowClear
        defaultValue={hostname}
      />
      {tagsData.map((tag) => {
        return (
          <CheckableTag
            style={{ marginRight: '4px' }}
            key={tag}
            checked={type === tag}
            onChange={() => handleChange(tag)}
          >
            {tag}
          </CheckableTag>
        )
      })}
      <div className={styles.legend}>
        <span>mock</span>
        <i style={{ background: '#87e8de' }}></i>
        <span>rewrite</span>
        <i style={{ background: '#d3adf7' }}></i>
      </div>
      <div className={styles.number}>
        <p>
          共
          <span className={cx(isNumWarn && styles.warn, isNumError && styles.error)}>
            {interceptList.length}
          </span>
          条
        </p>
        {isFilter && (
          <p>
            筛选后<span>{list.length}</span>条
          </p>
        )}
      </div>
      <ClearOutlined
        onClick={handleEmpty}
        style={{ color: '#333', cursor: 'pointer', fontSize: '14px' }}
      />
    </div>
  )
}

export default observer(Filter)
