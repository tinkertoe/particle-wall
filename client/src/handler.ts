import WebSocket from 'ws'

import loadFrames from './loadFrames'

export default function(address: string, directory: string, fps: string) {
  const frames = loadFrames(directory)
  const ws = new WebSocket(address)

  ws.on('open', () => {
    console.log('> connected')

    let f = 0
    setInterval(() => {
      if (f < frames.length) {
        console.log('> sending frame ' + f)
        ws.send(frames[f])       
        f++
      } else {
        ws.close()
        process.exit(0)
      }
    }, 1000/parseInt(fps))
  })

  ws.on('close', () => {
    console.log('> disconnected')
    process.exit(1)
  })

  ws.on('error', (err) => {
    throw err
  })

}