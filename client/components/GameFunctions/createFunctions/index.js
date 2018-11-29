import { players } from './addPlayers'
import { keyboardControls } from './keyboardControls'
import { scoreAndStars } from './lifeStars';
import { epithelialCells, makeEpithelialCell, epithelialCellCollision } from './epithelialCells'
import { tCells, makeTCell } from './tCells'
import { mastCells, makeMastCell, activate } from './mastCells'
import {infectedCells, spawnInfectedCell} from './npcInfectedCell'

export { 
  players, keyboardControls, scoreAndStars,
  epithelialCells, makeEpithelialCell, epithelialCellCollision,
  tCells, makeTCell,
  mastCells, makeMastCell, activate,
  infectedCells, spawnInfectedCell
}