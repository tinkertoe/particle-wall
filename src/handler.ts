import fs from 'fs'
import path from 'path'
import { loadImage, createCanvas } from 'canvas'

import Pixel from './Pixel'
import eightBit from './eightBit'

export default async function handler(directory: string, options: { frameDelay: string }) {
  // Load signal generator template
  // const signalGeneratorTemplatePath = path.join(__dirname, './signalGeneratorTemplate.c')
  // const signalGeneratorTemplate = fs.readFileSync(signalGeneratorTemplatePath, { encoding: 'utf8' })
  // console.log(signalGeneratorTemplate)

  let dataSourceCode = ''

  const fileNames = fs.readdirSync(directory)

  for (let i = 0; i < fileNames.length; i++){
    if (fileNames[i].endsWith('.png')) {
      const filePath = path.join(directory, fileNames[i])
      const frame = await loadImage(fs.readFileSync(filePath))
      
      const canvas = createCanvas(frame.width, frame.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(frame, 0, 0)
      const frameData = ctx.getImageData(0, 0, frame.width, frame.height)
      
      const framePixels: Pixel[] = []
      
      for (let i = 0; i < frameData.data.length; i = i + 4) {
        framePixels.push({
          R: frameData.data[i],
          G: frameData.data[i+1],
          B: frameData.data[i+2],
          A: frameData.data[i+3]
        })
      }

      // TODO(tinkertoe): reorder pixel array, for now just leave it

      let framePackets = ''

      for (let i = 0; i < framePixels.length; i++) {
        const pixel = framePixels[i]

        let pixelPacket = ''
        pixelPacket += eightBit(pixel.G)
        pixelPacket += eightBit(pixel.R)
        pixelPacket += eightBit(pixel.B)
        pixelPacket += eightBit(pixel.A)

        framePackets += pixelPacket
      }

      // console.log(framePackets)

    }
  }

}