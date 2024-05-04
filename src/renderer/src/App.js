import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Menu from './components/menu'
import Header from './components/header'
import Container from './components/container'
import ErrorBoundary from './components/errorBoundary'
import Setting from './pages/setting'
import List from './pages/list'
import Rewrite from './pages/rewrite'
import Mock from './pages/mock'
import MockList from './pages/mock/list'
import MockBox from './pages/mock/box'
import MockDetails from './pages/mock/details'
import Debug from './pages/debug'
import DebugList from './pages/debug/list'
import DebugDetails from './pages/debug/details'
import { useStore } from './stores/index'
import { watchInterceptList, watchDebugInfo } from './servers/push'
import { MENU_PAGES } from '@src/constant/common'
import './common.less'
import { putProxyPort, putProxyMode } from './servers/common'

function App() {
  const {
    interceptStore: { updataInterceptList },
    mockStore: { updataActiveMockList },
    rewriteStore: { updataRewriteServer },
    commonStore: { getAllConfig, allConfig, getAppInfo },
    debugStore: { updataDebugInfo, updataNetworkList }
  } = useStore()

  const { home } = allConfig

  const navigate = useNavigate()

  useEffect(() => {
    const { home, mode, port } = getAllConfig()
    putProxyMode(mode)
    putProxyPort(port)
    const { to } = MENU_PAGES.find((el) => el.value === home)
    navigate(to)
    getAppInfo()
    updataActiveMockList()
    updataRewriteServer()
    watchInterceptList((...data) => {
      updataInterceptList(...data)
      updataNetworkList(...data)
    })
    watchDebugInfo(updataDebugInfo)
  }, [])

  if (!home) return null

  return (
    <ErrorBoundary>
      <Header />
      <Container>
        <Routes>
          <Route path="/intercept" element={<List />} />
          <Route path="/rewrite" element={<Rewrite />} />
          <Route path="/mock" element={<Mock />}>
            <Route index element={<MockBox />} />
            <Route path="/mock/:appId" element={<MockList />} />
            <Route path="/mock/:appId/:apiId" element={<MockDetails />} />
          </Route>
          <Route path="/debug" element={<Debug />}>
            <Route index element={<DebugList />} />
            <Route path="/debug/:pageId" element={<DebugDetails />} />
          </Route>
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </Container>
      <Menu />
    </ErrorBoundary>
  )
}

export default observer(App)
