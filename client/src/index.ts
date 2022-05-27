import { program } from 'commander'
import handler from './handler'

program
  .description('sending nudes to a led wall')
  .argument('<address>', 'Address of particle wall server')
  .argument('<directory>', 'Path to directory with image sequence')
  .argument('<fps>', 'Frames per second')
  .action(handler)
  .parse(process.argv)