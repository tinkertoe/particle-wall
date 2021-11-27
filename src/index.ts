import { program } from 'commander'
import handler from './handler'

program
  .description('CLI for processing a image sequence into electrical data')
  .argument('<directory>', 'Path to directory with image sequence')
  .requiredOption('-f, --frame-delay <ms>', 'Delay between frames in ms')
  .action(handler) // <== main routine
  .parse(process.argv)