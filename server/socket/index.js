// const Message = require('./db/models/GameChat/message')
// const Channel = require('./db/models/GameChat/channel')
// const { fire } = require('../util')

module.exports = io => {
  let players = {}
  // CELL STORAGE NOW OBJECTS, LIKE PLAYER STORAGE
  let epithelialCells = {}
  let dormantTCells = {}
  let mastCells = {}
  let secretColor = {}
  // let star = {
  //   x: Math.floor(Math.random() * 900) + 50,
  //   y: Math.floor(Math.random() * 900) + 50
  // };
  let scores = {
    blue: 0,
    red: 0
  }

  io.on('connection', socket => {
    console.log(`A new player has arrived: ${socket.id}`)
    // create a new player and add it to our players object
    players[socket.id] = {
      angle: 0,
      position: {
        x: Math.floor(Math.random() * 900) + 50,
        y: Math.floor(Math.random() * 900) + 50,
      },
      velocity: {
        x: 0,
        y: 0
      },
      angularVelocity: 0,
      playerId: socket.id,
      team: (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue',
      clientDormantTCells: {}
    }
    
    // send the players object to the new player
    socket.emit('currentPlayers', players)
    // send the star object to the new player
    // socket.emit('starLocation', star)
    // send the epithelial cells to the new players
    socket.emit('epithelialCell', Object.values(epithelialCells))
    // send the dormant T-cells to the new players
    socket.emit('dormantTCell', dormantTCells)
    // send the mast cells to the new players, transfer ownership
    socket.broadcast.emit('disownMastCells')
    socket.emit('mastCell', mastCells)
    // send the current scores
    socket.emit('scoreUpdate', scores)
    // set the secret color if the player is first to join
    if (Object.keys(players).length <= 1) {
      secretColor.value = Math.floor(Math.random() * 16777215)
    }
    // send the secret color
    socket.emit('secretColor', secretColor.value)
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])
    // LAG WHEN NEW PLAYER JOINS

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
      console.log(`Player ${socket.id} has left the game`)
      const passingCellIds = Object.keys(players[socket.id].clientDormantTCells)
      delete players[socket.id]
      // passing on of "ownerships" (but only if there are any more players to begin with)
      if (Object.keys(players).length > 0) {
        // Pass "their" T cells onto the player with the lowest number
        io.to(`${findLowestCellPlayerId(players)}`).emit('passDormantTCells', passingCellIds)
        const randomPlayerId = Object.keys(players)[Math.floor(Math.random() * Object.keys(players).length)]
        io.to(`${randomPlayerId}`).emit('passMastCells')
      }
      // remove this player from our players object
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id)
      if (!Object.keys(players).length) {
        epithelialCells = {}
        dormantTCells = {}
        mastCells = {}
        secretColor = {}
      }
    })

    // when a player moves, update the player data
    socket.on('playerMovement', function ({ angle, position, velocity, angularVelocity }) {
      if (players[socket.id]) {
      players[socket.id].angle = angle
      players[socket.id].position = position
      players[socket.id].velocity = velocity
      players[socket.id].angularVelocity = angularVelocity
      // players[socket.id].rotation = movementData.rotation
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id])
      }
    })

    // socket.on('starCollected', function () {
    //   if (players[socket.id].team === 'red') {
    //     scores.red += 10
    //   } else {
    //     scores.blue += 10
    //   }
    //   star.x = Math.floor(Math.random() * 900) + 50
    //   star.y = Math.floor(Math.random() * 900) + 50
    //   io.emit('starLocation', star)
    //   io.emit('scoreUpdate', scores)
    // })

    socket.on('newEpithelialCells', (newCells) => {
      Object.assign(epithelialCells, newCells)
    })

    socket.on('changedEpithelialCell', (globalId, cellData) => {
      // epithelialCells[globalId].tint = 0xd60000
      for (let param in cellData) {
        epithelialCells[globalId][param] = cellData[param]
      }
      socket.broadcast.emit('changedEpithelialCellClient', globalId, cellData)
    })

    socket.on('deleteEpithelialCell', globalId => {
      delete epithelialCells[globalId]
      socket.broadcast.emit('deletedEpithelialCell', globalId)
    })

    socket.on('myNewTCells', (newCells) => {
      Object.assign(dormantTCells, newCells)
      Object.assign(players[socket.id].clientDormantTCells, newCells)
      socket.broadcast.emit('addDormantTCells', newCells)
    })

    socket.on('requestNewTCells', cellData => { //CELLDATA RECEIVED IS AN ARRAY BECAUSE IT HAS NO IDS YET
      const lowestCellPlayerId = findLowestCellPlayerId(players)
      if (lowestCellPlayerId === null) return
      // The next available globalId, determined by the server to ensure consistency
      let nextId = Math.max(...Object.keys(dormantTCells)) + 1
      const cellDataObj = cellData.reduce((obj, currCell) => {
        // Please humor my code golf here, I'm bored; assigns currCell to nextId, and nextId to currCell's globalId
        return {...obj, [nextId]: {...currCell, globalId: nextId++}}
      }, {})
      Object.assign(dormantTCells, cellDataObj)
      Object.assign(players[lowestCellPlayerId].clientDormantTCells, cellDataObj)
      io.emit('addDormantTCells', cellDataObj, lowestCellPlayerId)
    })

    socket.on('changedTCells', cellData => { //NOW AN OBJECT
      // Object.assign doesn't work right for some reason?
      for (let id in cellData) {
        dormantTCells[id] = cellData[id]
      }
      socket.broadcast.emit('changedDormantTCells', cellData)
    })

    socket.on('newMastCells', newCells => {
      Object.assign(mastCells, newCells)
    })

    socket.on('updateMastCells', cellData => {
      for (let id in cellData) {
        mastCells[id] = cellData[id]
      }
      socket.broadcast.emit('updateMastCellsClient', cellData)
    })

    socket.on('firedAntibody', (firingInfo) => {
      // fire.call(this, x, y, angle)
      if (firingInfo.type === 'tCell') {
        dormantTCells[firingInfo.id].angle = firingInfo.angle
      } else if (firingInfo.type === 'player') {
        players[firingInfo.id].angle = firingInfo.angle
      }
      socket.broadcast.emit('otherFiredAntibody', firingInfo)
    })

    socket.on('new-message', message => {
      socket.broadcast.emit('new-message', message)
    })

    socket.on('new-channel', channel => {
      socket.broadcast.emit('new-channel', channel)
    })
  })
}

function findLowestCellPlayerId(players) {
  return Object.keys(players).reduce((currLowestPlayer, id) => {
    const currAmount = Object.keys(players[id].clientDormantTCells).length
    if (!currLowestPlayer.id || currLowestPlayer.amount > currAmount) return {id, amount: currAmount}
    else return currLowestPlayer
  }, {id: null}).id
}