import WebSocket from 'ws'

import loadFrames from './loadFrames'
import sendFrame from './sendFrame'

export default function(address: string, directory: string, fps: string) {
  const frames = loadFrames(directory)
  const ws = new WebSocket(address)
  ws.binaryType = 'arraybuffer'

  let i = 0
  const loop = setInterval(() => {
    if (i < frames.length) { 
      sendFrame(frames[i], ws)
    } else {
      clearInterval(loop)
    }
    i++
  }, 1000/parseInt(fps)).ref()
}