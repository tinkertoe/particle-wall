import eightBit from './eightBit'
import { Pixel } from './types'

export default (frames: Uint8Array[]) => {
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

  return framePackets
}