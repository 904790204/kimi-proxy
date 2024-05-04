import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Select, Form, Input, InputNumber, Button, message } from 'antd'
import CodeEtitor from '@src/components/codeEditor'
import { METHODS } from '@src/constant/mock'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import { getProxyData } from '@src/utils'
import Headers from './headers'
import styles from './index.less'

const MockDetails = () => {
  const [form] = Form.useForm()
  const { appId = '' } = useParams()
  const {
    mockStore: { setMockApi, activeApi }
  } = useStore()
  const navigate = useNavigate()
  const [extendCode, setExtendCode] = useState('')
  const [headersValue, setHeadersValue] = useState([])
  // 格式化代码
  const handleFormat = () => {
    try {
      const json = JSON.parse(extendCode)
      const jsonStr = JSON.stringify(json, null, 2)
      setExtendCode(jsonStr)
    } catch (error) {
      console.log(error)
    }
  }
  // 返回
  const handleBack = () => {
    navigate(`/mock/${appId}`)
  }
  // 保存代码
  const handleSave = () =>
    form.validateFields().then(async (item) => {
      setMockApi({
        ...activeApi,
        ...item,
        response: extendCode
      })
      message.success('保存接口成功！')
      return item
    })
  // 保存并退出
  const handleSaveAndBack = async () => {
    await handleSave()
    handleBack()
  }
  // 设置当前数据
  useEffect(() => {
    if (activeApi) {
      const { response, ...values } = activeApi
      const params = getProxyData({ ...values })
      setHeadersValue(Array.isArray(params.headers) ? params.headers : [])
      form.setFieldsValue(params)
      setExtendCode(response)
    }
  }, [activeApi])
  return (
    <div className={styles.mockDetails}>
      <CodeEtitor value={extendCode} onChange={setExtendCode} />
      <div className={styles.mockEdit}>
        <Form form={form} name="mock">
          <Form.Item
            label="描述"
            name="describe"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="方法" name="method" rules={[{ required: true, message: '请选择方法' }]}>
            <Select placeholder="请选择接口方法" options={METHODS}></Select>
          </Form.Item>

          <Form.Item label="路径" name="path" rules={[{ required: true, message: '请输入路径' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="状态码"
            name="statusCode"
            rules={[{ required: true, message: '请输入状态码' }]}
          >
            <InputNumber max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="延迟" name="delay" initialValue={0}>
            <InputNumber max={10000} step={100} addonAfter="ms" />
          </Form.Item>
          <Form.Item
            label="响应头"
            name="headers"
            initialValue={[]}
            style={{ marginBottom: '10px' }}
          >
            <Headers onChange={setHeadersValue} />
          </Form.Item>
          <div className={styles.headersView}>
            {headersValue.map((el) => (
              <div className={styles.item} key={el.name}>
                <span>{el.name}:</span>
                <span>{el.value}</span>
              </div>
            ))}
          </div>
        </Form>
        <div className={styles.mockOperate}>
          <Button.Group>
            <Button type="primary" onClick={handleSaveAndBack}>
              保存并返回
            </Button>
          </Button.Group>
          <Button.Group>
            <Button type="primary" onClick={handleFormat}>
              格式化
            </Button>
            <Button onClick={handleBack}>返回</Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Button.Group>
        </div>
      </div>
    </div>
  )
}

export default observer(MockDetails)
