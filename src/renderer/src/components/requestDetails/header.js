import { useMemo } from 'react'
import TextInfo from '@src/components/textInfo'

const Header = (props) => {
  const { details = {} } = props
  const { href, method, statusCode, resHeaders = {}, reqHeaders = {} } = details
  const generalOpt = useMemo(
    () => ({
      title: 'General',
      children: [
        {
          label: 'Request URL',
          value: href
        },
        {
          label: 'Request Method',
          value: method
        },
        {
          label: 'Status Code',
          value: statusCode
        }
      ]
    }),
    [href, method, statusCode]
  )
  const responseOpt = useMemo(
    () => ({
      title: 'Response Header',
      children: Object.keys(resHeaders).map((key) => ({
        label: key,
        value: resHeaders[key]
      }))
    }),
    [resHeaders]
  )
  const requestOpt = useMemo(
    () => ({
      title: 'Request Header',
      children: Object.keys(reqHeaders).map((key) => ({
        label: key,
        value: reqHeaders[key]
      }))
    }),
    [reqHeaders]
  )
  return (
    <>
      <TextInfo options={generalOpt} />
      <TextInfo options={responseOpt} />
      <TextInfo options={requestOpt} />
    </>
  )
}

export default Header
