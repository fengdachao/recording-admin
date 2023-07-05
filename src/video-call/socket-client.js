import { HOST } from '../constant'

const serverUrl = `ws${document.location.protocol === 'https:' ? 's' : ''}://${HOST}:6503` 
const socketClient = new WebSocket(serverUrl, "json")
export default socketClient