import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import CodeEditor from '../../components/codeEditor'
// import CodeEditor from '../../components/codemirror'
// import CodeEditor from './editor'
// import HostEditor from '../../components/hostEditor'
import styles from './index.less'

const RewriteContent = (props) => {
  const { active, onChange } = props
  const { code, id } = active || {}
  const [extendCode, setExtendCode] = useState('')
  // useEffect(() => {
  //   new HostEditor({
  //     id: '#HostEditor',
  //     value: `# www.baidu.com/api http://localhost:8080\r\n\r\nwww.baidu.com/api http://localhost:8080`
  //   })
  // }, [])
  const handleDebounceChange = useCallback(debounce(onChange, 200), [onChange])
  const handleChange = (value) => {
    // setExtendCode(value)
    handleDebounceChange({
      ...active,
      code: value
    })
  }

  useEffect(() => {
    if (code) {
      setExtendCode(code)
    }
  }, [code])

  return (
    <div className={styles.rewriteCode} id="HostEditor">
      <CodeEditor key={id} mode="gitignore" value={code} onChange={handleChange} />
    </div>
  )
}

export default RewriteContent
