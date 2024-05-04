import { useMemo } from 'react'
import { CopyOutlined } from '@ant-design/icons'
import TextInfo from '@src/components/textInfo'
import { copyContent } from '@src/utils'
import styles from './index.less'

const ValueItem = ({ data, name }) => {
  const handleCopy = (text) => {
    copyContent(text)
  }
  return (
    <div className={styles.valueItem}>
      <span className={styles.text}>{data[name]}</span>
      <CopyOutlined onClick={() => handleCopy(data[name])} />
    </div>
  )
}

const DebugStorage = (props) => {
  const { pageData = {} } = props
  const { storage = {} } = pageData
  const { cookie = {}, localStorage = {}, sessionStorage = {} } = storage
  const cookieInfo = useMemo(
    () => ({
      title: 'Cookie',
      children: Object.keys(cookie).map((key) => ({
        label: key,
        value: <ValueItem name={key} data={cookie} />
      }))
    }),
    [cookie]
  )
  const localStorageInfo = useMemo(
    () => ({
      title: 'LocalStorage',
      children: Object.keys(localStorage).map((key) => ({
        label: key,
        value: <ValueItem name={key} data={localStorage} />
      }))
    }),
    [localStorage]
  )
  const sessionStorageInfo = useMemo(
    () => ({
      title: 'SessionStorage',
      children: Object.keys(sessionStorage).map((key) => ({
        label: key,
        value: <ValueItem name={key} data={sessionStorage} />
      }))
    }),
    [sessionStorage]
  )

  return (
    <>
      <TextInfo
        options={cookieInfo}
        bordered
        labelStyle={{ width: '200px', maxWidth: '200px', wordBreak: 'break-all' }}
      />
      <TextInfo
        options={localStorageInfo}
        bordered
        labelStyle={{ width: '200px', maxWidth: '200px', wordBreak: 'break-all' }}
      />
      <TextInfo
        options={sessionStorageInfo}
        bordered
        labelStyle={{ width: '200px', maxWidth: '200px', wordBreak: 'break-all' }}
      />
    </>
  )
}

export default DebugStorage
