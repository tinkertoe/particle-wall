import loadFrames from './loadFrames'
import dgram from 'node:dgram'

export default function(address: string, port: string, directory: string, fps: string) {
  const frames = loadFrames(directory)
  const socket = dgram.createSocket('udp4')

  let currentFrame = 0

  setInterval(() => {
    if (currentFrame < frames.length) {
      console.log('> sending frame ' + (currentFrame+1))
      socket.send(frames[currentFrame], parseInt(port), address)

      currentFrame++
    } else {
      process.exit(0)
    }
  }, 1000/parseInt(fps))
}