import Phaser from 'phaser'

const numberOfMastCells = 10
const numberOfDormantTCells = 5
const numberOfEpithelialCells = 5

export function NPCCells() {
  //Create automated mast cells and their histamine secretors
  //This code creates mast cells that secrete histamines. Histamines activate dormant immune cells to alert them of an active infection. Contact with the histamines being secreted should activate nearby dormant white blood cells: additional code is needed for this functionality speed of cells and their secretion speeds should also be adjusted

  const particles = new Array(numberOfMastCells).fill(this.add.particles('histamines'))
  particles.forEach(particle => {
    const randomSpeed = Math.floor(Math.random() * 150)
    const secretors = particle.createEmitter({
      speed: randomSpeed,
      scale: {
        start: 1,
        end: 0
      },
      blendMode: 'ADD'
    })

    const mastCells = this.physics.add.group({
      key: 'mastCell'
    })
    mastCells.children.entries.forEach(mastCell => {
      const randomMastCellSpeedX = Math.floor(Math.random() * 100)
      const randomMastCellSpeedY = Math.floor(Math.random() * 250)
      const randomCellLocationX = Math.floor(Math.random() * 500)
      const randomCellLocationY = Math.floor(Math.random() * 500)
      mastCell.setVelocity(randomMastCellSpeedX, randomMastCellSpeedY)
      mastCell.setBounce(1, 1)
      mastCell.setCollideWorldBounds(true)
      secretors.startFollow(mastCell)
      mastCell.x = randomCellLocationX
      mastCell.y = randomCellLocationY
    })
  })

  //These dormant cells need to be dispersed randomly throughout the arena, have random speeds, and be able to interact with the histomines (particles) emitted by the mast cells
  const dormantTCells = this.physics.add.group({
    key: 'dormantTCell',
    repeat: numberOfDormantTCells,
    setXY: {
      x: 100,
      y: 100,
      stepX: 200
    }
  })
  dormantTCells.children.entries.forEach(cell => {
    const randomX = Math.floor(Math.random() * 100)
    const randomY = Math.floor(Math.random() * 250)
    const randomCellLocationX = Math.floor(Math.random() * 500)
    const randomCellLocationY = Math.floor(Math.random() * 500)
    cell.setVelocity(randomX, randomY)
    cell.setBounce(1, 1)
    cell.setCollideWorldBounds(true)
    cell.x = randomCellLocationX
    cell.y = randomCellLocationY
  })
  let circle = new Phaser.Geom.Circle(400, 300, 150)
  // Randomly position the dormantTCells within the circle
  Phaser.Actions.RandomCircle(dormantTCells.getChildren(), circle)

  // These epithelialCells are lung cells that act as the possible infection sites. If infected, it'll produce more units for the infected team. They need to be protected by the white blood cells to avoid losing the game
  const epithelialCells = this.physics.add.group({
    key: 'epithelialCell',
    repeat: numberOfEpithelialCells,
    setXY: {
      x: 100,
      y: 100,
      stepX: 200
    }
  })
  epithelialCells.children.entries.forEach(cell => {
    const randomCellLocationX = Math.floor(Math.random() * 500)
    const randomCellLocationY = Math.floor(Math.random() * 500)
    cell.x = randomCellLocationX
    cell.y = randomCellLocationY
  })
}
