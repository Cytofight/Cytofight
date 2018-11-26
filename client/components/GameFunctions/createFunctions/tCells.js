import { worldSize, defaultCellParams, setCellParams } from '../util'

export function tCells(amount) {
  this.socket.on('dormantTCell', (cells) => {
    this.dormantTCells = {}
    if(!Object.keys(cells).length) {
      console.log("I WAS CREATED FOR THE FIRST TIME!!!")
      // CELL DATA STORAGE IS OBJECT W/ GLOBAL IDS
      const cellData = {}
      for (let i = 0; i < amount; i++) {
        const randomPositionX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
        const randomPositionY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
        const randomVelocityX = Math.floor(Math.random() * 8 - 4)
        const randomVelocityY = Math.floor(Math.random() * 8 - 4)
        const randomAngularVelocity = Math.random() * 0.5 - 0.25
        // Since these are the first cells, the client can handle the IDs with no need for server guidance
        cellData[i] = {
          positionX: randomPositionX, positionY: randomPositionY, 
          velocityX: randomVelocityX, velocityY: randomVelocityY, 
          angle: 0, angularVelocity: randomAngularVelocity,
          randomDirection: {x: 0, y: 0}, globalId: i
        }
        this.dormantTCells[i] = makeTCell.call(this, cellData[i])
      }
      this.clientDormantTCells = {...this.dormantTCells} // must make copy b/c otherwise client list will always be identical
      this.socket.emit('myNewTCells', cellData)
    } else {
      console.log("I was not. I was created by someone else who came before you")
      for (let id in cells) {
        this.dormantTCells[id] = makeTCell.call(this, cells[id])
      }
      this.clientDormantTCells = {}
    }
  })

  // Mid-game generation of any new T cells
  this.socket.on('addDormantTCells', (newCells, ownerId) => {
    for (let id in newCells) {
      const newCell = makeTCell.call(this, newCells[id])
      this.dormantTCells[id] = newCell
      // If the server decides that you should be responsible for the new cell(s)
      if (ownerId === this.socket.id) this.clientDormantTCells[id] = newCell
    }
  })

  // When a player disconnects and the server decides you should get responsibility for their cells
  this.socket.on('passDormantTCells', passedCellIds => { // AN ARRAY
    passedCellIds.forEach(id => {
      if (this.dormantTCells[id]) this.clientDormantTCells[id] = this.dormantTCells[id]
    })
    console.log('passed cells, new total client cells: ', this.clientDormantTCells)
  })

  this.socket.on('changedDormantTCells', cellData => {
    for (let id in cellData) {
      const currCell = this.dormantTCells[id]
      setCellParams(currCell, cellData[id])
    }
  })
}

export function makeTCell(cellDatum){
  const cell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'dormantTCell')
  cell.setCircle(cell.width / 2, defaultCellParams)
  setCellParams(cell, cellDatum)
  // cell.activate = function() {
  //     this.setVelocity(0, 0) //PLACEHOLDER
  //     console.log("I'm a good guy now!")
  //     cell.setTint(0x01c0ff)

  //     cell.activated = true
  //   }
  return cell
}