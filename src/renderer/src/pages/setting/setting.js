import { Descriptions, Checkbox, Button, Space, Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { MENU_PAGES } from '@src/constant/common'
import { useStore } from '@src/stores'

const Setting = (props) => {
  const { config, info } = props
  const { update, home } = config
  const { version } = info
  const {
    commonStore: { saveAllConfig }
  } = useStore()

  // 首页设置
  const handleHomePage = (ev) => {
    const val = ev.target.value
    saveAllConfig('home', val)
  }

  // 自动更新
  const handleAutoUpdata = (ev) => {
    const val = ev.target.checked
    saveAllConfig('update', val)
  }

  return (
    <>
      <Descriptions title={null} column={2}>
        {/* <Descriptions.Item label="账户名称">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="账号">1810000000</Descriptions.Item> */}
        <Descriptions.Item label="默认首页" span={2}>
          <Radio.Group options={MENU_PAGES} value={home} onChange={handleHomePage} />
        </Descriptions.Item>
        <Descriptions.Item label="应用信息">
          <Space size="large">
            <span>版本: {version}</span>
            {/* <span>
              自动更新
              <Checkbox
                label="自动更新"
                style={{ marginLeft: '2px' }}
                checked={update}
                onChange={handleAutoUpdata}
              />
            </span> */}
            {/* <Button size="small">退出账号</Button> */}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default observer(Setting)
