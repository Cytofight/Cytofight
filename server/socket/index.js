// const Message = require('./db/models/GameChat/message')
// const Channel = require('./db/models/GameChat/channel')

module.exports = io => {
  let players = {}
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
      team: (Math.floor(Math.random() * 2) === 0) ? 'red' : 'blue'
    }
    
    // send the players object to the new player
    socket.emit('currentPlayers', players)
    // send the star object to the new player
    socket.emit('starLocation', star)
    // send the current scores
    socket.emit('scoreUpdate', scores)
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
      console.log(`Player ${socket.id} has left the game`)
      // remove this player from our players object
      delete players[socket.id]
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id)
    })

    // when a player moves, update the player data
    socket.on('playerMovement', function ({ angle, position, velocity, angularVelocity }) {
<<<<<<< HEAD
      if (players[socket.id]) {
      players[socket.id].angle = angle
      players[socket.id].position = position
      players[socket.id].velocity = velocity
      players[socket.id].angularVelocity = angularVelocity
      // players[socket.id].rotation = movementData.rotation
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id])
=======
      if(players[socket.id]){
        players[socket.id].angle = angle
        players[socket.id].position = position
        players[socket.id].velocity = velocity
        players[socket.id].angularVelocity = angularVelocity
        // players[socket.id].rotation = movementData.rotation
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id])
>>>>>>> master
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

    socket.on('new-message', message => {
      socket.broadcast.emit('new-message', message)
    })

    socket.on('new-channel', channel => {
      socket.broadcast.emit('new-channel', channel)
    })
  })
}
