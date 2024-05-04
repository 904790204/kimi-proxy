import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { AimOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Modal, Space, Input, Button, Tag, Empty, Form, Tooltip } from 'antd'
import { useStore } from '../../stores'
import styles from './index.less'

const MatchHost = () => {
  const [matchVisible, setMatchVisible] = useState(false)
  const [form] = Form.useForm()
  const {
    commonStore: { matchHosts, addMatchHosts, delMatchHosts, switchMatchHosts }
  } = useStore()

  const handleAddHostname = (values) => {
    const { name } = values
    addMatchHosts(name)
    form.resetFields()
  }

  const handleDelHostname = (id) => {
    delMatchHosts(id)
  }

  const handleSwitchHostname = (el) => {
    const { id, name, status } = el
    switchMatchHosts(id, name, !status)
  }
  return (
    <>
      <Tooltip title="精准匹配">
        <AimOutlined onClick={() => setMatchVisible(true)} className={styles.aimIcon} />
      </Tooltip>
      <Modal
        title="精准匹配"
        open={matchVisible}
        footer={null}
        onCancel={() => setMatchVisible(false)}
        bodyStyle={{ minHeight: '200px' }}
      >
        <Form form={form} onFinish={handleAddHostname}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入正确域名' }]}
            extra={
              <p className={styles.matchPoint}>
                <QuestionCircleOutlined />
                生效之后将只拦截该域名和该域名下发起的请求
              </p>
            }
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="请输入需要匹配的域名" />
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
        <div>
          {matchHosts.length ? (
            matchHosts.map((el) => (
              <Tag
                key={el.id}
                color={el.status ? 'processing' : 'default'}
                closable
                onClose={() => handleDelHostname(el.id)}
                onClick={() => handleSwitchHostname(el)}
                style={{ cursor: 'pointer', marginBottom: '4px' }}
              >
                {el.name}
              </Tag>
            ))
          ) : (
            <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </Modal>
    </>
  )
}

export default observer(MatchHost)
