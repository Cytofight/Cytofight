import Phaser from 'phaser'

const histamineParticles = 10
const numberOfMastCells = 10
const numberOfDormantTCells = 5

export function NPCCells () {
 //Create automated mast cells and their histamine secretors
  //This code creates mast cells that secrete histamines. Histamines activate dormant immune cells to alert them of an active infection. Contact with the histamines being secreted should activate nearby dormant white blood cells: additional code is needed for this functionality; speed of cells and their secretion speeds should also be adjusted

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
      blendMode: 'ADD'
    })
    const mastCells = new Array(numberOfMastCells).fill(this.physics.add.image(randomX, randomY, 'mastCell'))
    mastCells.forEach(mastCell => {
      mastCell.setVelocity(30, 70)
      mastCell.setBounce(1, 1);
      mastCell.setCollideWorldBounds(true);
      secretors.startFollow(mastCell)
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
    const randomX = Math.floor(Math.random() * 10)
    const randomY = Math.floor(Math.random() * 100)
    dormantTCells.setVelocity(randomX, randomY)
    cell.setBounce(1, 1)
    cell.setCollideWorldBounds(true)
  })
  let circle = new Phaser.Geom.Circle(400, 300, 150)
  //  Randomly position the sprites within the circle
  Phaser.Actions.RandomCircle(dormantTCells.getChildren(), circle);
}