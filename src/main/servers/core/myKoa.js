function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  function dispatch(i, req, res) {
    let middlewareFn = middleware[i]
    try {
      return Promise.resolve(middlewareFn(req, res, dispatch.bind(null, i + 1, req, res)))
    } catch (err) {
      return Promise.reject(err)
    }
  }
  return function fn(req, res) {
    return dispatch(0, req, res)
  }
}

class Koa {
  constructor() {
    this.middleware = []
  }

  use(fn) {
    this.middleware.push(fn)
  }

  handleRequest(req, res) {
    const fn = compose(this.middleware)
    fn(req, res)
  }
}

export default Koa
