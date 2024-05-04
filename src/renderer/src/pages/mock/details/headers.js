import { useEffect, useState } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.less'

const { List, Item } = Form

const Headers = (props) => {
  const { value = [], onChange } = props
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const handleEditSubmit = () => {
    form.validateFields().then(async (item) => {
      const { headers = [] } = item
      const result = headers.reduce((res, current) => {
        const { name, value: val } = current
        const n = name && name.trim()
        const v = val && val.trim()
        if (n && v) {
          return [...res, { name: n, value: v }]
        }
        return res
      }, [])
      onChange(result)
      setVisible(false)
    })
  }

  // 编辑header时，如无数据，自动添加一条空数据
  useEffect(() => {
    if (visible) {
      let arr = [...value]
      if (arr.length === 0) {
        arr.push({
          name: '',
          value: ''
        })
      }
      form.setFieldsValue({ headers: arr })
    }
  }, [visible])
  return (
    <>
      <Button size="small" onClick={() => setVisible(true)} className={styles.editBtn}>
        编辑
      </Button>
      <Modal
        title="编辑响应头"
        open={visible}
        onOk={handleEditSubmit}
        onCancel={() => setVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} name="headers" className={styles.headerForm}>
          <List name="headers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => {
                  return (
                    <div
                      key={key}
                      style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}
                    >
                      <Item
                        name={[name, 'name']}
                        style={{ flex: 1, marginBottom: 0, marginRight: '10px' }}
                        rules={[
                          { required: true, message: '请输入响应头名称' },
                          {
                            validator: (_, value) =>
                              /[\u4E00-\u9FA5]/.test(value)
                                ? Promise.reject(new Error('请输入正确格式响应头名称'))
                                : Promise.resolve()
                          }
                        ]}
                      >
                        <Input placeholder="响应头名称" />
                      </Item>
                      <Item
                        name={[name, 'value']}
                        style={{ flex: 1, marginBottom: 0, marginRight: '10px' }}
                        rules={[
                          { required: true, message: '请输入响应头值' },
                          {
                            validator: (_, value) =>
                              /[\u4E00-\u9FA5]/.test(value)
                                ? Promise.reject(new Error('请输入正确格式响应头值'))
                                : Promise.resolve()
                          }
                        ]}
                      >
                        <Input placeholder="响应头值" />
                      </Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </div>
                  )
                })}
                <Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    增加一条
                  </Button>
                </Item>
              </>
            )}
          </List>
        </Form>
      </Modal>
    </>
  )
}

export default Headers
