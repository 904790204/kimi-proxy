import { useEffect, useMemo } from 'react'
import { Breadcrumb, Button } from 'antd'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores'
import ModalForm from './form'
import styles from './index.less'

const Mock = () => {
  const navigate = useNavigate()
  const params = useParams()
  const {
    mockStore: {
      modalInfo,
      setModalInfo,
      fetchActiveApp,
      fetchMockDetails,
      activeApi,
      activeApp,
      apps
    }
  } = useStore()
  // 新建窗口显示、类型
  const { visible: editModalVisible, type: editModalType } = modalInfo
  const { appId, apiId } = params
  const isDetails = !!params.apiId
  const isList = !isDetails && !!params.appId
  const isBox = !isList && !isDetails

  // 打开新建窗口
  const handleAddMock = (type) => {
    setModalInfo({
      visible: true,
      type
    })
  }

  // 面包屑导航
  const paths = useMemo(() => {
    const result = [
      {
        title: <Link to="/mock">接口模拟</Link>
      }
    ]
    if (isList) {
      return [
        ...result,
        {
          title: activeApp.hostname
        }
      ]
    }
    if (isDetails) {
      return [
        ...result,
        {
          title: <Link to={`/mock/${appId}`}>{activeApp.hostname}</Link>
        },
        {
          title: activeApi.path
        }
      ]
    }
    return result
  }, [isDetails, isList, activeApp, activeApi])

  // 返回上一级
  const handleBack = () => {
    if (isList) {
      navigate('/mock')
    }
    if (isDetails) {
      navigate(`/mock/${appId}`)
    }
  }

  // 路由变更时获取当前选中应用信息
  useEffect(() => {
    fetchActiveApp(appId)
  }, [appId])

  // 路由变更时获取当前选中接口信息
  useEffect(() => {
    fetchMockDetails(apiId)
  }, [apiId])

  return (
    <div className={styles.mock}>
      <div className={styles.header}>
        <Breadcrumb separator=">" items={paths} />
        <div className={styles.operate}>
          {!isBox && <ArrowLeftOutlined onClick={handleBack} />}
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddMock('app')}
          >
            项目
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddMock('api')}
          >
            接口
          </Button>
        </div>
      </div>
      <Outlet context={{ handleAddMock }} />
      <ModalForm
        visible={editModalVisible}
        onVisible={() => setModalInfo({ visible: false })}
        type={editModalType}
        isBox={isBox}
      />
    </div>
  )
}

export default observer(Mock)
