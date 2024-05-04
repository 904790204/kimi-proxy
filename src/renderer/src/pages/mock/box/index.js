import { Col, Row, Modal, Empty, Switch } from 'antd'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useStore } from '@src/stores'
import styles from './index.less'
import { useEffect } from 'react'

const MockBox = () => {
  const {
    mockStore: { apps = [], fetchMockApps, setModalInfo, delMockApp, setMockApps }
  } = useStore()
  const navigate = useNavigate()
  const { handleAddMock } = useOutletContext()
  // 进入应用接口列表
  const handleAppContent = (item) => {
    const { id } = item
    navigate(`/mock/${id}`)
  }
  // 删除应用
  const handleDelApp = (e, item) => {
    e.stopPropagation()
    const { hostname, name, id } = item
    Modal.warning({
      title: '删除',
      content: `确认删除「${name} - ${hostname}」`,
      okText: '确定',
      maskClosable: true,
      onOk() {
        delMockApp(id).then(() => {
          fetchMockApps()
        })
      }
    })
  }
  // 编辑应用
  const handleEditApp = (e, item) => {
    e.stopPropagation()
    setModalInfo({
      visible: true,
      type: 'app',
      active: item
    })
  }

  // 切换应用开光状态
  const handleSwitchOpen = async (status, item) => {
    await setMockApps({
      ...item,
      status
    })
    fetchMockApps()
  }

  useEffect(() => {
    fetchMockApps().then((res) => {
      if (res.length === 0) {
        handleAddMock('app')
      }
    })
  }, [])

  return (
    <div className={styles.box}>
      {apps.length ? (
        <Row>
          {apps.map((item) => (
            <Col
              key={item.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              xxl={3}
              onClick={() => handleAppContent(item)}
            >
              <div className={styles.item}>
                <h3 className={styles.title}>{item.name}</h3>
                <div className={styles.info}>
                  {item.describe ? (
                    item.describe
                  ) : (
                    <span style={{ color: '#bfbfbf' }}>项目描述</span>
                  )}
                </div>
                <div className={styles.info}>{item.hostname}</div>
                <div className={styles.operate}>
                  <DeleteOutlined onClick={(e) => handleDelApp(e, item)} />
                  <FormOutlined onClick={(e) => handleEditApp(e, item)} />
                  <div onClick={(e) => e.stopPropagation()} className={styles.open}>
                    <Switch
                      size="small"
                      onChange={(e) => handleSwitchOpen(e, item)}
                      checked={item.status}
                    ></Switch>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      )}
    </div>
  )
}

export default observer(MockBox)
