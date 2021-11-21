// https://stackoverflow.com/questions/26242887/js-efficient-way-to-convert-integer-to-8-digit-binary
export default function eightBit(dez: number) {
  return ('00000000' + dez.toString(2)).substr(-8)
}