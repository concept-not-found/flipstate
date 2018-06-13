export default (getThat, getUpdate) => {
  if (!process || !process.env || process.env.NODE_ENV === 'production') {
    return () => {}
  }
  let devToolSubscribed
  function sendStateToDevTool () {
    const {origin, source} = devToolSubscribed
    source.postMessage({
      protocol: 'flipstate-devtool v1',
      type: 'application state',
      location: window.location.href,
      state: JSON.stringify(getThat().state)
    }, origin)
    devToolSubscribed = undefined
  }
  window.addEventListener('message', (event) => {
    const {origin, data = {}, source} = event
    if (!origin.startsWith('http://localhost:') && origin !== 'https://concept-not-found.github.io') {
      return
    }
    switch (data.type) {
      case 'get state':
        devToolSubscribed = {
          source,
          origin
        }
        return sendStateToDevTool()
      case 'set state':
        return getUpdate()(JSON.parse(data.state))
      case 'subscribe state update':
        devToolSubscribed = {
          source,
          origin
        }
        return
      case 'move history backwards':
        window.history.go(-1)
        return sendStateToDevTool()
      case 'move history forwards':
        window.history.go(1)
        return sendStateToDevTool()
      default:
        // ignore messages we don't understand
    }
  }, false)

  return () => {
    if (devToolSubscribed) {
      sendStateToDevTool()
    }
  }
}
