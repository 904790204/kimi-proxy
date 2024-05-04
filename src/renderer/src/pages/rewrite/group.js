import { useState } from 'react'
import { Switch, Modal } from 'antd'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import cx from 'classname'
import styles from './index.less'

const RewriteGroup = (props) => {
  const { groups, onActive, active, setEditModal, onDel, onSwitch } = props
  const { id: activeId } = active || {}
  const handleEditModal = (e, item) => {
    e.stopPropagation()
    setEditModal({
      ...item,
      visible: true
    })
  }
  const handleSwitch = (status, e, val) => {
    e.stopPropagation()
    const params = { ...val, status }
    onSwitch(params)
  }
  const handleDel = (e, item) => {
    e.stopPropagation()
    const { id, name } = item
    Modal.warning({
      title: '删除',
      content: `确认删除「${name}」`,
      okText: '确定',
      maskClosable: true,
      onOk() {
        onDel(id)
      }
    })
  }
  return (
    <div className={styles.rewriteGroup}>
      {groups.map((el) => (
        <div
          key={el.id}
          className={cx(styles.item, activeId === el.id && styles.active)}
          onClick={() => onActive(el)}
        >
          <label className={styles.label}>{el.name}</label>
          <div className={styles.operate}>
            {groups.length > 1 && <DeleteOutlined onClick={(e) => handleDel(e, el)} />}
            <FormOutlined onClick={(e) => handleEditModal(e, el)} />
            <Switch size="small" checked={el.status} onChange={(s, e) => handleSwitch(s, e, el)} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default RewriteGroup
