import {limitSpeed, updateForce, limitNumber, throttle} from './speed'
import {fire} from './fireAntibodies'

export const worldSize = {x: 2000, y: 2000}
export const colorNumber = 64
export const randomName = ['Fritter', 'Fizband', 'JollyGreenDwarf', 'MeatShield', 'Come\'on?', 'Buckethead', 'Captain Wasteland', 'American Eagle', 'Moo Soup', 'Blue Whale', 
  'Jasper', 'Xanthos', 'Xanthan Gum', 'Achilles', 'Axios', 'Socket.io O.o', 'FullStack Academy of Cells', 'iPhone 17', 'Bill Gates', 'Steve Jhobs', 'Scarf', 'Magic Schoolbus', 'PressEnter', 
  'Task Manager', 'Double O Sleven', 'Thorny Chair', 'AlienWare', 'Am I sick?', 'Tom Deck', 'Securitron', 'Brad.', 'Stephen', 'Geoff', 'Geohn', 'Cytophyter', 'Sticky', 'Stretchy', 
  'Goehb', 'Jeb', 'BinarySearchLeaph', 'PressCtrlArtDel?', 'Huh', 'DeadlySell', 'Brooclin', 'Cytation', 'IBM Wahtson', 'Samsung Jalaxi', 'HunterCiller', 'React.gs', 'Siteophage', 
  'Sore Eye', 'Rusty Nail', 'Krisper-Kas009', 'Princess Phytocyte', 'NoSQL', 'Pickles', 'Rover', 'Gigg1es', 'Buster', 'Marvin', 'Slacker', 'Cyt.io', 'Walla-Walla', 'Stumpy', 
  'Weasle', 'Sausey', 'Drangus', 'Draco Malfoy', 'Fancy', 'Bogz', 'Harry Beard', 'Fizzbuzz', 'Wizz', 'FooBar', 'Bellerophon', 'Memnon', 'Mancy', 'Echidna', 'Chrysaor', 'Cuobp', 
  'Stupiditon', 'Blubhby', 'Mustiy', 'Robobert', 'Dotp', 'Idiotway Stupidton', 'Tucker Carlson', 'Wedgewood Swepston III', 'Comte. DeQuincey Stallworth Bakersfield, Esq. PhD', 
  'Bick', 'Claude Luciani', 'Abet Cup', 'One Man', 'Infahht', 'A Plastic Bag', 'where am me', 'Armand K. Armand', 'Lemon Squeezie', 'Pototo', 'i love uoue']

export const defaultCellParams = {
  restitution: 1,
  friction: 0,
  frictionAir: 0
}

export function resetCells() {
  this.badGuys = {}
  this.goodGuys = {}
  this.dormantTCells = {}
  this.mastCells = {}
  this.infectedCells = {}
}

export function overlapCollision(coords, largeBody, callback, ...args) {
  if (largeBody.getBounds().contains(coords.x, coords.y)) {
    callback.call(this, ...args)
  }
}

export function setCellParams(
  cell,
  {
    positionX,
    positionY,
    velocityX,
    velocityY,
    angle,
    angularVelocity,
    randomDirection,
    tint,
    globalId,
    health
  }
) {
  cell.setPosition(positionX, positionY)
  cell.setVelocity(velocityX, velocityY)
  // cell.setAngle(angle) // blocks spin transmission for some reason
  cell.setAngularVelocity(angularVelocity)
  if (tint) {
    cell.setTint(tint)
  }
  if (randomDirection) cell.randomDirection = randomDirection
  if (health) cell.health = health
  cell.globalId = globalId
}

// CURRENTLY BROKEN, DO NOT USE
export function changeShipColorDebug(tint) {
  let prevAlignment, nextAlignment
  const currShipTint = this.ship.tintBottomLeft
  this.ship.setTint(tint)
  if (tint === 0x01c0ff && currShipTint === 214) {
    prevAlignment = this.badGuys
    nextAlignment = this.goodGuys
  } else if (tint === 0xd60000 && currShipTint === 16760833) {
    prevAlignment = this.goodGuys
    nextAlignment = this.badGuys
  }
  console.log('previous and next alignments: ', prevAlignment, nextAlignment)
  const currIndex = prevAlignment.indexOf(this.ship)
  console.log(currIndex)
  if (currIndex !== -1) prevAlignment.splice(currIndex, 1)
  nextAlignment.push(this.ship)
  console.log(
    'ship tint is blue: ',
    this.ship.tintBottomLeft === 16760833,
    'ship tint is red: ',
    this.ship.tintBottomLeft === 214,
    'arrays now: ',
    this.badGuys,
    this.goodGuys
  )
}

export function updateSecretColor(color) {
  if (
    color - this.secretColor.value <= 262000 &&
    color - this.secretColor.value >= -262000
  ) {
    this.secretColor.found = true
    return true
  }
  return false
}

export {limitSpeed, updateForce, limitNumber, throttle, fire}
