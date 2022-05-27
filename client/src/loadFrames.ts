import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'

export default function(directory: string) {
  const fileNames = fs.readdirSync(directory)
  const frames: Uint8Array[] = []
  
  for (let i = 0; i < fileNames.length; i++){
    if (fileNames[i].endsWith('.png')) {
      const filePath = path.join(directory, fileNames[i])
      const png = PNG.sync.read(fs.readFileSync(filePath))
      
      frames.push(new Uint8Array(png.data))
    }
  }

  return frames
}