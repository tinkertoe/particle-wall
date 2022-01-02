import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'

import loadFrames from './loadFrames'
import packFrames from './packFrames'
import generateCode from './generateCode'

const filesPath = path.join(os.tmpdir(), 'particle-wall-src')

export default (directory: string, options: { frameDelay: string }) => {
  const frames = loadFrames(directory)
  const framePackets = packFrames(frames)

  if (fs.existsSync(filesPath)) { fs.rmSync(filesPath, { recursive: true, force: true }) }
  fs.mkdirSync(filesPath)

  framePackets.forEach((packet, i) => {
    const sourceFilePath = path.join(filesPath, `${i}.c`)
    const executableFilePath = path.join(filesPath, `${i}`)
    
    const sourceCode = generateCode(packet)
    fs.writeFileSync(sourceFilePath, sourceCode)

    execSync(`gcc ${sourceFilePath} -o ${executableFilePath} -v -lbcm2835 -O3`)
  })

  // const executablePath = path.join(os.tmpdir(), './particle-wall-animation')
  // execSync(`gcc ${cCodePath} -o ${executablePath} -v -lbcm2835 -O3`)

  // console.log('Executing...')
  // execFileSync(executablePath)
}