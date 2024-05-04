import { Form, Input } from 'antd'
const { Item: FormItem } = Form

const AppForm = () => {
  return (
    <>
      <FormItem
        label="项目名称"
        name="name"
        rules={[{ required: true, message: '请输入项目名称' }]}
      >
        <Input placeholder="请输入项目名称" />
      </FormItem>
      <FormItem label="项目描述" name="appDescribe">
        <Input placeholder="请输入项目描述" />
      </FormItem>
      <FormItem
        label="域名"
        name="hostname"
        rules={[{ required: true, message: '请输入项目域名' }]}
      >
        <Input placeholder="请输入项目域名" />
      </FormItem>
    </>
  )
}

export default AppForm
