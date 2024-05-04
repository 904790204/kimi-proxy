import { useMemo } from 'react'
import CodeEtitor from '@src/components/codeEditor'
import TextInfo from '@src/components/textInfo'
import styles from './index.less'

const Payload = (props) => {
  const { details = {} } = props
  const { search, payload, method } = details
  const isGet = method === 'GET'

  const options = useMemo(() => {
    if (isGet) {
      const params = Object.fromEntries(new URLSearchParams(search).entries())
      return {
        title: 'Payload',
        children: Object.keys(params).map((key) => ({
          label: key,
          value: params[key]
        }))
      }
    } else {
      let params = {}
      try {
        params = JSON.stringify(JSON.parse(payload), null, 2)
      } catch (error) {
        params = JSON.stringify(payload, null, 2)
      }
      return params
    }
  }, [search, payload])

  return isGet ? (
    <TextInfo options={options} />
  ) : (
    <div className={styles.preview}>
      <CodeEtitor value={options} readOnly />
    </div>
  )
}

export default Payload
