// const Message = require('./db/models/GameChat/message')
// const Channel = require('./db/models/GameChat/channel')

module.exports = io => {
  let players = {}
  // CELL STORAGE NOW OBJECTS, LIKE PLAYER STORAGE
  let epithelialCells = {}
  let dormantTCells = {}
  let star = {
    x: Math.floor(Math.random() * 900) + 50,
    y: Math.floor(Math.random() * 900) + 50
  };
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
    socket.emit('starLocation', star)
    // send the epithelial cells to the new players
    socket.emit('epithelialCell', Object.values(epithelialCells))
    // send the dormant T-cells to the new players
    socket.emit('dormantTCell', dormantTCells)
    // send the current scores
    socket.emit('scoreUpdate', scores)
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
      console.log(`Player ${socket.id} has left the game`)
      // Pass "their" T cells onto the player with the lowest number
      // (Only if there are multiple players to begin with)
      if (Object.keys(players).length > 1) {
        const lowestCellPlayerId = Object.keys(players).reduce((currLowestPlayer, id) => {
          const currAmount = Object.keys(players[id].clientDormantTCells).length
          if (!currLowestPlayer.id || currLowestPlayer.amount > currAmount) return {id, amount: currAmount}
          else return currLowestPlayer
        }, {id: null}).id
        io.to(`${lowestCellPlayerId}`).emit('passDormantTCells', Object.keys(players[socket.id].clientDormantTCells))
      }
      // remove this player from our players object
      delete players[socket.id]
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id)
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

    // socket.on('anyCollision', (bodyA, bodyB) => {
    //   // console.log('received anyCollision with', bodyA, bodyB)
    //   //receive and broadcast four-datas of both bodies
    //   // socket.broadcast.emit('collided', bodyA, bodyB)
    // })

    socket.on('starCollected', function () {
      if (players[socket.id].team === 'red') {
        scores.red += 10
      } else {
        scores.blue += 10
      }
      star.x = Math.floor(Math.random() * 900) + 50
      star.y = Math.floor(Math.random() * 900) + 50
      io.emit('starLocation', star)
      io.emit('scoreUpdate', scores)
    })

    socket.on('newEpithelialCells', (newCells) => {
      // newCells.forEach(cell => {
      //   epithelialCells[cell.globalId] = cell
      // })
      // epithelialCells = {...epithelialCells, ...newCells}

      // Basically like pushing newCells into epithelialCells, but for an object
      Object.assign(epithelialCells, newCells)
    })

    socket.on('changedEpithelialCell', globalId => {
      // epithelialCells.forEach(cell => {
      //   if (cell.globalId === globalId) cell.tint = 0xd60000
      // })
      epithelialCells[globalId].tint = 0xd60000
      socket.broadcast.emit('changedEpithelialCellClient', globalId)
    })

    socket.on('newTCells', (newCells) => {
      // console.log('EXAMPLE OF NEW T CELLS ON SERVER: ', newCells[0])
      // dormantTCells.push(...newCells)
      // players[socket.id].clientDormantTCells.push(...newCells)
      // dormantTCells = {...dormantTCells, ...newCells}
      // players[socket.id].clientDormantTCells = {...players[socket.id].clientDormantTCells, newCells}
      Object.assign(dormantTCells, newCells)
      Object.assign(players[socket.id].clientDormantTCells, newCells)
      console.log('CLIENT AND SERVER T CELLS: ', players[socket.id].clientDormantTCells, dormantTCells)
      socket.broadcast.emit('addDormantTCells', newCells)
    })

    socket.on('requestNewTCells', cellData => { //CELLDATA RECEIVED IS AN ARRAY BECAUSE IT HAS NO IDS YET
      const playerIds = Object.keys(players)
      let lowestCellPlayerId
      if (playerIds.length === 0) return // dunno how this would happen, but whatever
      else if (playerIds.length === 1) lowestCellPlayerId = playerIds[0]
      else {
        lowestCellPlayerId = playerIds.reduce((currLowestPlayer, id) => {
          const currAmount = Object.keys(players[id].clientDormantTCells).length
          if (!currLowestPlayer.id || currLowestPlayer.amount > currAmount) return {id, amount: currAmount}
          else return currLowestPlayer
        }, {id: null, amount: Infinity}).id
      }
      // The next available globalId, determined by the server to ensure consistency
      let nextId = Math.max(...Object.keys(dormantTCells)) + 1
      // const cellDataObj = {}
      // cellData.forEach(cell => {
      //   cell.globalId = nextId
      //   cellDataObj[nextId] = cell
      //   nextId++
      // })
      const cellDataObj = cellData.reduce((obj, currCell) => {
        // Please humor my code golf here, I'm bored; assigns currCell to nextId, and nextId to currCell's globalId
        return {...obj, [nextId]: {...currCell, globalId: nextId++}}
      }, {})
      Object.assign(dormantTCells, cellDataObj)
      Object.assign(players[lowestCellPlayerId].clientDormantTCells, cellDataObj)
      io.emit('addDormantTCells', cellDataObj, lowestCellPlayerId)
    })

    socket.on('changedTCells', cellData => { //NOW AN OBJECT
      // const Ids = cellData.map(datum => datum.globalId)

      // dormantTCells.forEach(cell => {
      //   const currIdIndex = Ids.indexOf(cell.globalId)
      //   if (currIdIndex > -1) 
      // })
      // cellData.forEach(datum => {
      //   const relevantCell = dormantTCells.find(cell => cell.globalId === datum.globalId)
      //   relevantCell = datum
      // })
      for (let id in cellData) {
        // Object.assign(dormantTCells[id], cellData[id])
        dormantTCells[id] = cellData[id]
      }
      socket.broadcast.emit('changedDormantTCells', cellData)
    })

    socket.on('new-message', message => {
      socket.broadcast.emit('new-message', message)
    })

    socket.on('new-channel', channel => {
      socket.broadcast.emit('new-channel', channel)
    })
  })
}
