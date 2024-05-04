import { useMemo } from 'react'
import TextInfo from '@src/components/textInfo'

const Info = (props) => {
  const { pageData = {} } = props
  const { info = {} } = pageData
  const infos = useMemo(
    () => ({
      title: 'info',
      children: Object.keys(info).map((key) => ({
        label: key,
        value: info[key]
      }))
    }),
    [info]
  )
  return <TextInfo options={infos} />
}

export default Info
