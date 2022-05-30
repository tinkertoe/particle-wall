import WebSocket from 'ws'
import loadFrames from './loadFrames'

export default function(address: string, directory: string, fps: string) {
  const frames = loadFrames(directory)
  const ws = new WebSocket(address)

  ws.on('open', () => {
    console.log('> connected')

    let currentFrame = 0

    setInterval(() => {
      if (currentFrame < frames.length) {
        console.log('> sending frame ' + (currentFrame+1))
        ws.send(frames[currentFrame])       
        currentFrame++
      } else {
        process.exit(0)
      }
    }, 1000/parseInt(fps))
  })

  ws.on('close', () => {
    throw new Error('Unexpected disconnect from server!')
  })

  ws.on('error', (err) => {
    throw err
  })
}