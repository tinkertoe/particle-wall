import fs from 'fs'
import path from 'path'
import os from 'os'
import { execFileSync, execSync, execFile } from 'child_process'
import { loadImage, createCanvas, ImageData } from 'canvas'

import Pixel from './Pixel'
import eightBit from './eightBit'

export default async function handler(directory: string, options: { frameDelay: string }) {

  // Load all frames of image sequence from directory
  const fileNames = fs.readdirSync(directory)
  const frames: ImageData[] = []
  
  for (let i = 0; i < fileNames.length; i++){
    if (fileNames[i].endsWith('.png')) {
      const filePath = path.join(directory, fileNames[i])
      const frameImage = await loadImage(fs.readFileSync(filePath))
      
      const canvas = createCanvas(frameImage.width, frameImage.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(frameImage, 0, 0)

      const frame = ctx.getImageData(0, 0, frameImage.width, frameImage.height)
      frames.push(frame)
    }
  }

  const framePackets: string[] = []

  frames.forEach(frame => {
    const framePixels: Pixel[] = []
    
    for (let i = 0; i < frame.data.length; i = i + 4) {
      framePixels.push({
        R: frame.data[i],
        G: frame.data[i+1],
        B: frame.data[i+2],
        A: frame.data[i+3]
      })
    }

    // TODO(tinkertoe): reorder pixel array, for now just leave it

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
    dataSourceCode += `usleep(${options.frameDelay}*1000);`
  })

  // Load signal generator template
  const cTemplatePath = path.join(__dirname, './signalGeneratorTemplate.c')
  const cTemplate = fs.readFileSync(cTemplatePath, { encoding: 'utf8' })

  const cCodePath = path.join(os.tmpdir(), './particle-wall-animation.c')
  const cCode = cTemplate.replace('/*DATA*/', dataSourceCode)
  fs.writeFileSync(cCodePath, cCode)

  console.log(`Source code at ${cCodePath}`)

  // const executablePath = path.join(os.tmpdir(), './particle-wall-animation')
  // execSync(`gcc ${cCodePath} -o ${executablePath} -lbcm2835`)

  // execFileSync(executablePath)
}