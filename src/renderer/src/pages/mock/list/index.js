import { useEffect } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { Table, Switch, Modal, message } from 'antd'
import { FormOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/stores'
import styles from './index.less'
import { copyContent } from '@src/utils'

const MockList = () => {
  const navigate = useNavigate()
  const { appId } = useParams()
  const {
    mockStore: { apis = [], fetchMockApis, setMockApi, delMockApi }
  } = useStore()
  const [messageApi, contextHolder] = message.useMessage()
  const { handleAddMock } = useOutletContext()

  // 进入编辑api详情页
  const handleEditApi = (item) => {
    const { id } = item
    navigate(`/mock/${appId}/${id}`)
  }

  // 切换接口状态
  const handleSwitchOpen = async (status, item) => {
    await setMockApi({
      ...item,
      status
    })
    await fetchMockApis(appId)
  }

  // 删除接口
  const handleDelApi = (item) => {
    const { path, id } = item
    Modal.warning({
      title: '删除',
      content: `确认删除「${path}」吗？`,
      okText: '确定',
      maskClosable: true,
      onOk() {
        delMockApi(id).then(() => {
          fetchMockApis(appId)
        })
      }
    })
  }

  // 复制接口路径
  const handleCopy = (item) => {
    copyContent(item.path)
    messageApi.open({
      type: 'success',
      content: '复制接口路径成功'
    })
  }

  useEffect(() => {
    fetchMockApis(appId).then((res) => {
      if (res.length === 0) {
        handleAddMock('api')
      }
    })
  }, [appId])

  // useEffect(() => {
  //   if (apis.length === 0) {
  //     handleAddMock('api')
  //   }
  // }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (val, raw, index) => index + 1
    },
    {
      title: '开关',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (val, item) => (
        <Switch checked={val} size="small" onChange={(e) => handleSwitchOpen(e, item)} />
      )
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      align: 'center'
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'center',
      render: (val, item) => (
        <div className={styles.operate}>
          <CopyOutlined onClick={() => handleCopy(item)} />
          <FormOutlined onClick={() => handleEditApi(item)} />
          <DeleteOutlined onClick={() => handleDelApi(item)} />
        </div>
      )
    }
  ]
  return (
    <div>
      <Table
        rowKey={(item) => item.id}
        size="small"
        pagination={false}
        columns={columns}
        dataSource={apis}
      />
      {contextHolder}
    </div>
  )
}

export default observer(MockList)
