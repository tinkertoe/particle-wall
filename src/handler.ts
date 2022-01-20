import fs from 'fs'
import path from 'path'

import loadFrames from './loadFrames'
import packFrames from './packFrames'
import generateCode from './generateCode'

export default (directory: string, options: { frameDelay: string }) => {
  const frames = loadFrames(directory)
  const framePackets = packFrames(frames)

  const dataFilePath = path.join(directory, `animation_data.ptw`)
  
  let data = ''
  framePackets.forEach(packet => {
    data += packet + 'X'
  })

  fs.writeFileSync(dataFilePath, data)
}