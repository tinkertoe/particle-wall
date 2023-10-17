import loadFrames from './loadFrames'
import dgram from 'node:dgram'
import { exec, spawn, execFile } from 'node:child_process'
import { join } from 'node:path'

export default function(address: string, port: string, directory: string, fps: string) {
  const frames = loadFrames(directory)
  const socket = dgram.createSocket('udp4')

  const audio = exec(`mplayer ${join(directory, 'audio.wav')}`)

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