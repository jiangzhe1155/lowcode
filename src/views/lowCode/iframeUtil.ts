export const addMessageListener = (eventType: string, callback: Function) => {
  window.addEventListener('message', (event) => {
    let { type } = event.data
    if (type === eventType) {
      callback(event.data.payload)
    }
  })
}

export const sendIframeMessage = (window: Window, eventType: string, payload: any) => {
  window.postMessage(
    {
      type: eventType,
      payload: payload
    }, '*')
}
