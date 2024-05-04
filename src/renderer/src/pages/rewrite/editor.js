import { useEffect, useRef, useState } from 'react'
import cx from 'classname'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import styles from './index.less'

const arr = [
  '# www.baidu.com/api http://localhost:8080',
  '',
  'www.baidu.com/api http://localhost:8080'
]

const Editor = (props) => {
  // const { value = [], onChange } = props
  const [value, setValue] = useState(arr)
  const [active, setActive] = useState(0)
  const editor = useRef(null)
  // const [code, setCode] = useState()

  // const
  // const {
  //   rewriteStore: { code = '' }
  // } = useStore()
  // console.log(value)
  // useEffect(() => {

  // }, [value])
  const handleKeyDown = (e, index) => {
    const theEvent = window.event || e
    const code = theEvent.keyCode || theEvent.which || theEvent.charCode
    if (code == 13) {
      e.preventDefault()
      const newValue = [...value]
      newValue.splice(index + 1, 0, '')
      setActive(active + 1)
      setValue(newValue)
    }
  }

  useEffect(() => {
    const target = editor.current.querySelector(`.index${active}`)
    setTimeout(() => {
      target.focus()
    })
  }, [active])

  return (
    <div className={styles.editor} ref={editor}>
      {value.map((el, index) => {
        const text = el.trim()
        // const [before, after] = texts
        const isDisable = text.startsWith('#')
        const isSussess = !isDisable && text.split(/\s+/).length === 2
        let before = ''
        let after = ''
        if (isSussess) {
          const i = text.split(/\s+/)[0].length
          before = text.slice(0, i)
          after = text.slice(i)
        }

        return (
          <div
            className={cx(styles.line, index === active && styles.active, `index${index}`)}
            key={index + el}
          >
            <div className={styles.index}>{index + 1}</div>
            <div
              contentEditable={true}
              className={cx(styles.text, isDisable && styles.disable, isSussess && styles.success)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActive(index)}
            >
              {isSussess ? (
                <>
                  <span>{before}</span>
                  <span>{after}</span>
                </>
              ) : (
                <>{el}</>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default observer(Editor)
