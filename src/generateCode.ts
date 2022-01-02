import fs from 'fs'

export default (packet: string) => {
  let frameCode = ''

  for (let i = 0; i < packet.length; i++) {
    switch (packet[i]) {
      case '0': frameCode += 'T0();'
      case '1': frameCode += 'T1();'
      default: break
    }
  }
  
  frameCode += 'RST();'

  let sourceCode = fs.readFileSync('src/signalGeneratorTemplate.c', { encoding: 'utf8' })
  sourceCode = sourceCode.replace('/*DATA*/', frameCode)

  return sourceCode
}