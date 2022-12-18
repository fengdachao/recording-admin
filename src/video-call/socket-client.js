const serverUrl = `ws${document.location.protocol === 'https:' ? 's' : ''}://${window.location.hostname}:6503` 
const socketClient = new WebSocket(serverUrl, "json")
export default socketClient