import { Descriptions } from 'antd'
import cx from 'classname'
import styles from './index.less'

const TextInfo = (props) => {
  const { options = {}, className = '', onClick, ...other } = props
  const { title, children, num = 1 } = options
  const handleClick = () => {
    onClick && onClick(options)
  }

  return (
    <div className={cx(styles.textInfo, className)} onClick={handleClick}>
      <Descriptions
        title={title}
        column={num}
        size="small"
        labelStyle={{ color: 'rgba(0, 0, 0, 0.88)' }}
        contentStyle={{ color: 'rgba(0, 0, 0, 0.45)' }}
        {...other}
      >
        {children.map((el) => {
          return (
            <Descriptions.Item key={el.label} {...el}>
              {el.value}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </div>
  )
}

export default TextInfo
