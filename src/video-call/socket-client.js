const serverUrl = `ws${document.location.protocol === 'https:' ? 's' : ''}://mongo-local:6503` 
const socketClient = new WebSocket(serverUrl, "json")
export default socketClient