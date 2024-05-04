import List from '@src/components/requestList'

const scrollY = window.innerHeight - 300
const Requests = ({ pageData = {} }) => {
  const { requests = [] } = pageData
  return <List list={requests} scrollY={scrollY} />
}

export default Requests
