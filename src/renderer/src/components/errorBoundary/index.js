import React from 'react'
import { Alert, Button } from 'antd'
import styles from './index.less'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  // static getDerivedStateFromError(error) {
  //   return { hasError: true, message: error }
  // }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
    const title = typeof error === 'object' ? error.toString() : error
    const message = `${title} \n ${errorInfo.componentStack}`
    this.setState({ hasError: true, message })
    // 可以将错误日志上报给服务器
  }

  handleReload() {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div className={styles.errorInfo}>
          <Alert
            message="页面报错"
            description={this.state.message}
            type="error"
            style={{ minWidth: '400px', marginBottom: '20px' }}
          />
          <Button type="primary" onClick={this.handleReload}>
            刷新
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
