import { useMemo } from 'react'
import { Image, Typography } from 'antd'
import { get } from 'lodash'
import { CopyOutlined } from '@ant-design/icons'
import CodeEtitor from '@src/components/codeEditor'
import styles from './index.less'
import { copyContent } from '@src/utils'

const { Paragraph } = Typography

const Response = (props) => {
  const { details = {} } = props
  const { href = '', response } = details
  const isImg = get(details, 'resHeaders.content-type', '').includes('image')

  const json = useMemo(() => {
    try {
      const val = JSON.parse(response)
      return JSON.stringify(val, null, 2)
    } catch (error) {
      return false
    }
  }, [response])

  const handleCopyJson = () => {
    copyContent(json)
  }

  if (isImg) {
    return <Image width="100%" src={href} />
  }
  if (json) {
    return (
      <div className={styles.preview}>
        <CodeEtitor value={json} readOnly />
        <CopyOutlined onClick={handleCopyJson} className={styles.copy} />
      </div>
    )
  }
  return <Paragraph>{response}</Paragraph>
}

export default Response
