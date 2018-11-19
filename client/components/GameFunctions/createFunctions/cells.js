// import Phaser from 'phaser'

// const histamineParticles = 2
const numberOfMastCells = 2
const numberOfDormantTCells = 5
// const numberOfEpithelialCells = 5

const defaultCellParams = {
  restitution: 1,
  friction: 0,
  frictionAir: 0
}

// function changeCell(secretor, cell) {
  //   console.log('OW, A PARTICLE COLLISION!')
  // }
  
export function NPCCells () {
  //Create automated mast cells and their histamine secretors
  //This code creates mast cells that secrete histamines. Histamines activate dormant immune cells to alert them of an active infection. Contact with the histamines being secreted should activate nearby dormant white blood cells: additional code is needed for this functionality speed of cells and their secretion speeds should also be adjusted
  // this.dormantTCells = this.physics.add.group({
  //   key: 'dormantTCell',
  //   repeat: numberOfDormantTCells,
  //   setXY: {
  //     x: 100,
  //     y: 100,
  //     stepX: 200
  //   }
  // })
  this.dormantTCells = new Array(numberOfDormantTCells).fill(null).map(cell => {
    const randomVelocityX = Math.floor(Math.random() * 8 - 4)
    const randomVelocityY = Math.floor(Math.random() * 8 - 4)
    const randomPositionX = Math.floor(Math.random() * 500)
    const randomPositionY = Math.floor(Math.random() * 500)

    cell = this.matter.add.image(randomPositionX, randomPositionY, 'dormantTCell')
    cell.setCircle(cell.width / 2, defaultCellParams)
    cell.setVelocity(randomVelocityX, randomVelocityY)
    cell.activated = false
    cell.activate = function() {
      this.setVelocity(0, 0) //PLACEHOLDER
      console.log("I'm a good guy now!")
      cell.activated = true
    }
    return cell
  })
  // this.dormantTCells.forEach(cell => {
    //   const randomX = Math.floor(Math.random() * 100)
    //   const randomY = Math.floor(Math.random() * 250)
    //   const randomCellLocationX = Math.floor(Math.random() * 500)
    //   const randomCellLocationY = Math.floor(Math.random() * 500)
    //   // cell.setBounce(1, 1)
    //   // cell.x = randomCellLocationX
    //   // cell.y = randomCellLocationY
    // cell.body.setCollideWorldBounds(true)
  //   // cell.setPosition(randomCellLocationX, randomCellLocationY)

  // })
  // let circle = new Phaser.Geom.Circle(400, 300, 150)
  // Randomly position the dormantTCells within the circle
  // Phaser.Actions.RandomCircle(this.dormantTCells.getChildren(), circle)
    
  const changeCell = {
    contains: (x, y) => {
      for (let i = 0; i < this.dormantTCells.length; i++) {
        const currCell = this.dormantTCells[i]
        if (currCell.getBounds().contains(x, y)) {
          if (!currCell.activated) {
            currCell.activate()
          }
          return true
        }
      }
      return false
    }
  }

  const particles = new Array(numberOfMastCells).fill(this.add.particles('histamines'))
  particles.forEach(particle => {
    const randomParticleSpeed = Math.floor(Math.random() * 150)
    const secretors = particle.createEmitter({
      x: 1,
      y: 1,
      speed: randomParticleSpeed,
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
    // const mastCells = []
    const randomMastCellSpeedX = Math.floor(Math.random() * 12 - 6)
    const randomMastCellSpeedY = Math.floor(Math.random() * 12 - 6)
    const randomX = Math.floor(Math.random() * 1000)
    const randomY = Math.floor(Math.random() * 1000)
    particle.mastCell = this.matter.add.image(randomX, randomY, 'mastCell')
    particle.mastCell.setCircle(particle.mastCell.width / 2, defaultCellParams)
    particle.mastCell.setVelocity(randomMastCellSpeedX, randomMastCellSpeedY)
    secretors.startFollow(particle.mastCell)
  // //   mastCells.forEach(mastCell => {
  // //     const randomCellLocationX = Math.floor(Math.random() * 500)
  // //     const randomCellLocationY = Math.floor(Math.random() * 500)
  // //     mastCell.setBounce(1, 1)
  // //     mastCell.setCollideWorldBounds(true)
  // //     mastCell.x = randomCellLocationX
  // //     mastCell.y = randomCellLocationY
  // //     console.log("Cell: ", mastCell)
  // //   })
  // // })

  // //These dormant cells need to be dispersed randomly throughout the arena, have random speeds, and be able to interact with the histomines (particles) emitted by the mast cells

  // // These epithelialCells are lung cells that act as the possible infection sites. If infected, it'll produce more units for the infected team. They need to be protected by the white blood cells to avoid losing the game
  // // const epithelialCells = this.physics.add.group({
  // //   key: 'epithelialCell',
  // //   repeat: numberOfEpithelialCells,
  // //   setXY: {
  // //     x: 100,
  // //     y: 100,
  // //     stepX: 200
  // //   }
  // // })
  // // epithelialCells.children.entries.forEach(cell => {
  // //   const randomCellLocationX = Math.floor(Math.random() * 500)
  // //   const randomCellLocationY = Math.floor(Math.random() * 500)
  // //   cell.x = randomCellLocationX
  // //   cell.y = randomCellLocationY
  })
}
