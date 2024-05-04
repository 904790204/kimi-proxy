import { Form, Input, Radio, InputNumber, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { METHODS } from '../../../constant/mock'
import { useStore } from '../../../stores'
import { useState } from 'react'
const { Item: FormItem } = Form

const AppForm = (props) => {
  const { isBox, form } = props
  const {
    mockStore: { apps = [] }
  } = useStore()

  // 是否同时新建应用
  const [isNew, setIsNew] = useState(true)
  // 选中一个应用
  const handleSelectApp = (e) => {
    const val = e.target.value
    // 选中新建按钮
    if (val) {
      const active = apps.find((el) => el.id === e.target.value)
      const { id, name, describe: appDescribe, hostname } = active
      form.setFieldsValue({
        id,
        name,
        appDescribe,
        hostname
      })
      setIsNew(false)
    } else {
      setIsNew(true)
      form.setFieldsValue({
        name: '',
        appDescribe: '',
        hostname: ''
      })
    }
  }
  return (
    <>
      {isBox && (
        <>
          <FormItem
            label="选择项目"
            name="id"
            rules={[{ required: true, message: '请选择项目' }]}
            initialValue={0}
          >
            <Radio.Group onChange={handleSelectApp}>
              <Radio value={0}>新建</Radio>
              {apps.map((item) => {
                return (
                  <Radio key={item.id} value={item.id}>
                    {item.name}/{item.hostname}
                  </Radio>
                )
              })}
            </Radio.Group>
          </FormItem>
          {isNew && (
            <FormItem
              label="项目名称"
              name="name"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </FormItem>
          )}
          <FormItem label="项目描述" name="appDescribe">
            <Input placeholder="请输入项目描述" disabled={!isNew} />
          </FormItem>
          <FormItem
            label="域名"
            name="hostname"
            rules={[{ required: true, message: '请输入项目域名' }]}
          >
            <Input placeholder="请输入项目域名" disabled={!isNew} />
          </FormItem>
        </>
      )}
      <FormItem
        label="接口描述"
        name="apiDescribe"
        rules={[{ required: true, message: '请输入接口描述' }]}
      >
        <Input placeholder="请输入接口描述" />
      </FormItem>
      <FormItem
        label="接口方法"
        name="method"
        rules={[{ required: true, message: '请选择接口方法' }]}
      >
        <Select placeholder="请选择接口方法" options={METHODS}></Select>
      </FormItem>
      <FormItem
        label="状态码"
        name="statusCode"
        rules={[{ required: true, message: '请输入项目名称' }]}
        initialValue={200}
      >
        <InputNumber
          style={{ width: '393px' }}
          placeholder="请输入接口状态码"
          max={999}
          min={100}
        />
      </FormItem>
      <FormItem
        label="路径"
        placeholder="请输入接口路径"
        name="path"
        rules={[{ required: true, message: '请输入项目名称' }]}
        initialValue={'/'}
      >
        <Input />
      </FormItem>
    </>
  )
}

export default observer(AppForm)
