import fs from 'fs'
import path from 'path'
import os from 'os'
import { PNG } from 'pngjs'
import { execFileSync, execSync, execFile } from 'child_process'

import Pixel from './Pixel'
import eightBit from './eightBit'

export default async function handler(directory: string, options: { frameDelay: string }) {

  // Load all frames of image sequence from directory
  const fileNames = fs.readdirSync(directory)
  const frames: Uint8Array[] = []
  
  for (let i = 0; i < fileNames.length; i++){
    if (fileNames[i].endsWith('.png')) {
      const filePath = path.join(directory, fileNames[i])
      const png = PNG.sync.read(fs.readFileSync(filePath))
      frames.push(new Uint8Array(png.data))
    }
  }

  const framePackets: string[] = []

  frames.forEach(frame => {

    // Turn frame data into array of pixels
    const framePixels: Pixel[] = []
    for (let i = 0; i < frame.length; i = i + 4) {
      framePixels.push({
        R: frame[i],
        G: frame[i+1],
        B: frame[i+2],
        A: frame[i+3]
      })
    }

    // TODO(tinkertoe): reorder pixel array, for now just leave it

    // Pack pixels into packets
    let framePacket = ''
    framePixels.forEach(pixel => {
      let pixelPacket = ''
      pixelPacket += eightBit(pixel.G)
      pixelPacket += eightBit(pixel.R)
      pixelPacket += eightBit(pixel.B)
      pixelPacket += eightBit(pixel.A)

      framePacket += pixelPacket
    })

    framePackets.push(framePacket)
  })


  let dataSourceCode = ''

  framePackets.forEach(framePacket => {
    for (let i = 0; i < framePacket.length; i++) {
      switch (framePacket[i]) {
        case '0': dataSourceCode += '0();'
        case '1': dataSourceCode += '1();'
      }
    }
    dataSourceCode += 'RST();'
    dataSourceCode += `usleep(${parseInt(options.frameDelay) * 1000});`
  })

  // Load signal generator template
  const cTemplate = fs.readFileSync('src/signalGeneratorTemplate.c', { encoding: 'utf8' })

  const cCodePath = path.join(os.tmpdir(), './particle-wall-animation.c')
  const cCode = cTemplate.replace('/*DATA*/', dataSourceCode)
  fs.writeFileSync(cCodePath, cCode)

  const executablePath = path.join(os.tmpdir(), './particle-wall-animation')
  execSync(`gcc ${cCodePath} -o ${executablePath} -lbcm2835`)

  execFileSync(executablePath)
}