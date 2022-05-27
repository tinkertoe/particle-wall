import WebSocket from 'ws'

export default function(frame: Uint8Array, ws: WebSocket) {
  if (ws.readyState == ws.OPEN) {
    ws.send(frame)
  }
}