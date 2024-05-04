import { useMemo } from 'react'
import TextInfo from '@src/components/textInfo'

const Cookie = (props) => {
  const {
    details: { reqHeaders: { cookie = '' } = {} }
  } = props
  const cookieOpt = useMemo(() => {
    const cookies = cookie.split(';')
    const children = cookies.map((el) => {
      const [key, val] = el.trim().split('=')
      return {
        label: decodeURIComponent(key),
        value: decodeURIComponent(val)
      }
    })
    return {
      title: 'Cookie',
      children
    }
  }, [cookie])
  return <TextInfo options={cookieOpt} />
}

export default Cookie
