import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Modal, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { PlusOutlined } from '@ant-design/icons'
import { useStore } from '../../stores'
import styles from './index.less'
import RewriteGroup from './group'
import RewriteContent from './content'

const breadcrumbs = [{ title: <Link to="/rewrite">地址转发</Link> }]

const getDefaultGroupData = (name = '默认组') => {
  return {
    name,
    status: true,
    code: `# ${name}\r\n# https://kimi.takim.com http://localhost:8080\r\n`
  }
}
// https://www.zhihu.com http://localhost:7001
const Rewrite = () => {
  const {
    rewriteStore: {
      activeGroup,
      rewriteList,
      fetchRewriteList,
      putRewrite,
      setActiveGroup,
      delRewrite,
      updataRewriteServer
    }
  } = useStore()
  const [editModal, setEditModal] = useState({
    visible: false
  })
  const [form] = Form.useForm()

  // 新建转发组弹窗
  const handleAddGroup = () => {
    setEditModal({
      visible: true
    })
  }

  // 编辑code
  const handleCodeChange = (item) => {
    putRewrite(item)
    updataRewriteServer()
  }

  // 新建、编辑转发组表单提交
  const handleSubmit = async () => {
    const vals = await form.validateFields()
    const { name } = vals
    const { id, code, status } = editModal
    // 编辑
    if (id) {
      await putRewrite({
        id,
        code,
        status,
        name
      })
    } else {
      await putRewrite(getDefaultGroupData(name))
    }
    await fetchRewriteList()
    setEditModal({
      visible: false
    })
  }

  // 更新组状态
  const handleSwitchStatus = async (params) => {
    await putRewrite(params)
    await fetchRewriteList()
    updataRewriteServer()
  }

  // 删除组
  const handleDelGroup = async (id) => {
    await delRewrite(id)
    const res = await fetchRewriteList()
    const { id: activeId } = activeGroup
    if (activeId === id) {
      setActiveGroup(res[0])
    }
    updataRewriteServer()
  }

  // 获取转发列表
  useEffect(() => {
    fetchRewriteList().then(async (res) => {
      // 如果为空，则创建一条
      if (res.length === 0) {
        await putRewrite(getDefaultGroupData())
        fetchRewriteList()
      }
    })
  }, [])

  // 默认选中第一个组
  useEffect(() => {
    if (!!rewriteList.length && !activeGroup) {
      setActiveGroup(rewriteList[0])
    }
  }, [rewriteList, activeGroup])

  // 编辑组表单填充
  useEffect(() => {
    const { visible, name } = editModal
    if (visible) {
      form.setFieldsValue({ name })
    }
  }, [editModal])
  return (
    <div className={styles.rewrite}>
      <div className={styles.rewriteHeader}>
        <Breadcrumb items={breadcrumbs} />
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddGroup}>
          组
        </Button>
      </div>
      <div className={styles.rewriteContent}>
        <RewriteContent active={activeGroup} onChange={handleCodeChange} />
        <RewriteGroup
          active={activeGroup}
          groups={rewriteList}
          onActive={setActiveGroup}
          setEditModal={setEditModal}
          putRewrite={putRewrite}
          fetchRewriteList={fetchRewriteList}
          onDel={handleDelGroup}
          onSwitch={handleSwitchStatus}
        />
      </div>
      <Modal
        open={editModal.visible}
        onOk={handleSubmit}
        onCancel={() => setEditModal({ visible: false })}
        title="编辑"
        okText="确定"
        cancelText="取消"
      >
        <Form form={form}>
          <Form.Item label="组名" name="name" rules={[{ required: true, message: '请输入组名' }]}>
            <Input placeholder="请输入组名" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default observer(Rewrite)
