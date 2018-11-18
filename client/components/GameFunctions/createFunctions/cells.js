import Phaser from 'phaser'

const histamineParticles = 3
const numberOfMastCells = 3
const numberOfDormantTCells = 5
const numberOfEpithelialCells = 5

// function changeCell(secretor, cell) {
  //   console.log('OW, A PARTICLE COLLISION!')
  // }
  
export function NPCCells () {
  //Create automated mast cells and their histamine secretors
  //This code creates mast cells that secrete histamines. Histamines activate dormant immune cells to alert them of an active infection. Contact with the histamines being secreted should activate nearby dormant white blood cells: additional code is needed for this functionality speed of cells and their secretion speeds should also be adjusted
  this.dormantTCells = this.physics.add.group({
    key: 'dormantTCell',
    repeat: numberOfDormantTCells,
    setXY: {
      x: 100,
      y: 100,
      stepX: 200
    }
  })
  this.dormantTCells.children.entries.forEach(cell => {
    const randomX = Math.floor(Math.random() * 100)
    const randomY = Math.floor(Math.random() * 250)
    const randomCellLocationX = Math.floor(Math.random() * 500)
    const randomCellLocationY = Math.floor(Math.random() * 500)
    cell.setVelocity(randomX, randomY)
    cell.setBounce(1, 1)
    cell.setCollideWorldBounds(true)
    cell.x = randomCellLocationX
    cell.y = randomCellLocationY

    cell.activated = false
    cell.activate = function() {
      this.setVelocity(0, 0) //PLACEHOLDER
      console.log("I'm a good guy now!")
      cell.activated = true
    }
  })
  let circle = new Phaser.Geom.Circle(400, 300, 150)
  // Randomly position the dormantTCells within the circle
  Phaser.Actions.RandomCircle(this.dormantTCells.getChildren(), circle)
    
  const changeCell = {
    contains: (x, y) => {
      const cellsArr = this.dormantTCells.children.entries
      let hit
      for (let i = 0; i < cellsArr.length; i++) {
        const currCell = cellsArr[i]
        hit = currCell.body.hitTest(x, y)
        if (hit && !currCell.activated) {
          console.log('about to trig')
          currCell.activate()
          return hit
        }
      }
      return hit
    }
  }

  const particles = new Array(histamineParticles).fill(this.add.particles('histamines'))
  particles.forEach(particle => {
    const randomSpeed = Math.floor(Math.random() * 150)
    const randomX = Math.floor(Math.random() * 1000)
    const randomY = Math.floor(Math.random() * 10000)
    const secretors = particle.createEmitter({
      speed: randomSpeed,
      scale: {
        start: 1,
        end: 0
      },
      blendMode: 'ADD',
      deathZone: {
        type: 'onEnter',
        source: changeCell
      }
    })
    const mastCells = new Array(numberOfMastCells).fill(this.physics.add.image(randomX, randomY, 'mastCell'))
    mastCells.forEach(mastCell => {
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
      console.log("Cell: ", mastCell)
    })
  })

  //These dormant cells need to be dispersed randomly throughout the arena, have random speeds, and be able to interact with the histomines (particles) emitted by the mast cells

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