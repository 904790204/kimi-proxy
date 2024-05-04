import { Descriptions, Radio, Space, Tooltip, InputNumber, Tag, message, Row, Col } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { PROXYMODE_OPTIONS } from '@src/constant/common'
import { useStore } from '@src/stores'
import { putProxyMode, putProxyPort } from '@src/servers/common'

const SETTINGCOLUMN = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }

const Network = (props) => {
  const {
    commonStore: { proxyChecked, saveAllConfig }
  } = useStore()
  const { config, info } = props
  const { mode, port } = config
  const { caStatus, en0 } = info
  // 代理服务模式切换
  const handleMode = (ev) => {
    const val = ev.target.value
    saveAllConfig('mode', val)
    putProxyMode(val)
    message.success('代理模式切换成功')
  }

  // 修改端口
  const handlePort = (ev) => {
    const val = ev.target.value
    if (!!val && val !== port) {
      saveAllConfig('port', val)
      putProxyPort(val)
      message.success('代理端口修改成功')
    }
  }
  return (
    <>
      <Descriptions title={null} column={SETTINGCOLUMN}>
        <Descriptions.Item label="代理服务" span={1}>
          <Space>
            <Tag color={proxyChecked ? 'green' : 'orange'}>
              {proxyChecked ? '已开启' : '未开启'}
            </Tag>
            <Radio.Group
              style={{ marginTop: '2px' }}
              options={PROXYMODE_OPTIONS}
              value={mode}
              onChange={handleMode}
            />
          </Space>
        </Descriptions.Item>

        <Descriptions.Item
          span={1}
          label={
            <>
              证书状态
              {
                <span
                  style={{ display: 'block', paddingLeft: '4px', color: 'rgba(0, 0, 0, 0.45)' }}
                >
                  <Tooltip title="代理https服务需要先信任证书，首次信任后不需要再次操作">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
            </>
          }
        >
          <Space>
            {caStatus ? <Tag color="green">已信任</Tag> : <Tag color="origin">未信任</Tag>}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="ip地址">{en0}</Descriptions.Item>

        <Descriptions.Item label="当前端口">
          <InputNumber size="small" value={port} onBlur={handlePort} />
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default observer(Network)
