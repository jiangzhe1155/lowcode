export const addMessageListener = (eventType: string, callback: Function) => {
  window.addEventListener('message', (event) => {
    let { type } = event.data
    if (type === eventType) {
      callback(event.data.payload)
    }
  })
}

export const sendIframeMessage = (html: Window, eventType: string, payload: any) => {
  html.postMessage(
    {
      type: eventType,
      payload: payload
    }, '*')
}
