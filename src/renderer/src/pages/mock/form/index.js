import { Modal, Form } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../stores'
import { useEffect } from 'react'
import AppForm from './appForm'
import ApiForm from './apiForm'

const { useForm } = Form

const ModalForm = (props) => {
  const { visible, onVisible, type, isBox } = props
  const [form] = useForm()
  const routeParams = useParams()
  const navigate = useNavigate()
  const {
    mockStore: { setMockApps, fetchMockApps, modalInfo, setModalInfo, setMockApi, fetchMockApis }
  } = useStore()
  const { active } = modalInfo
  const { id: activeId, status: activeStatus } = active
  const isApp = type === 'app'

  // 表单提交
  const handleSubmit = () => {
    form.validateFields().then(async (item) => {
      let res = {}
      if (isApp) {
        await handleCreateAppSubmit(item)
      } else {
        res = await handleCreateApiSubmit(item)
      }
      onVisible(false)
      if (isApp) {
        navigate(`/mock`)
      } else {
        navigate(`/mock/${res.appId}`)
      }
    })
  }

  // 应用表单提交
  const handleCreateAppSubmit = async (item) => {
    const { id, name, hostname, appDescribe: describe } = item
    const params = {
      name,
      hostname,
      describe: describe || '',
      status: true
    }
    // 编辑
    if (id || activeId) {
      params.id = id || activeId
      params.status = activeStatus
    }
    const res = await setMockApps(params)
    await fetchMockApps()
    return res || params.id
  }

  // 接口表单提交
  const handleCreateApiSubmit = async (item) => {
    const { id: aId, apiDescribe, method, path, statusCode, hostname, appDescribe, name } = item
    let newAppId
    if (isBox && !aId) {
      newAppId = await handleCreateAppSubmit({ id: aId, name, hostname, appDescribe })
    }
    const appid = newAppId || aId || routeParams.appId
    const res = await setMockApi({
      appid: Number(appid),
      describe: apiDescribe,
      path,
      status: true,
      statusCode,
      method,
      response: ''
    })
    await fetchMockApis(appid)
    return { appId: appid, apiId: res }
  }

  // 关闭弹窗
  const handleModalClose = () => {
    setModalInfo({
      visible: false,
      type: '',
      active: {}
    })
    form.resetFields()
  }

  useEffect(() => {
    if (activeId && isApp) {
      const { describe } = active
      form.setFieldsValue({ ...active, appDescribe: describe })
    }
  }, [visible, activeId])

  return (
    <Modal
      title="新建接口"
      open={visible}
      onOk={handleSubmit}
      onCancel={() => onVisible(false)}
      okText="确定"
      cancelText="取消"
      afterClose={handleModalClose}
    >
      <Form labelCol={{ span: 4 }} form={form}>
        {isApp ? <AppForm /> : <ApiForm isBox={isBox} form={form} />}
      </Form>
    </Modal>
  )
}

export default observer(ModalForm)
