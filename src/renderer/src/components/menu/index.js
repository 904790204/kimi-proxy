import styles from './index.less'
import cs from 'classname'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MENU_PAGES } from '@src/constant/common'

const Menu = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const active = useMemo(() => {
    const { value } = MENU_PAGES.find((el) => pathname.startsWith(el.to))
    return value
  })

  return (
    <div className={styles.menu}>
      {MENU_PAGES.map((el) => (
        <div
          key={el.value}
          className={cs(styles.item, el.value === active && styles.active)}
          onClick={() => navigate(el.to)}
        >
          {el.icon}
          <span>{el.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Menu
