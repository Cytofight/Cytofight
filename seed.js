const db = require('./server/db')
const Author = require('./server/db/models/GameChat/author')
const Message = require('./server/db/models/GameChat/message')
const Channel = require('./server/db/models/GameChat/channel')

const channels = [
  { name: 'really_game' },
  { name: 'generally_speaking' },
]

const authors = [{
  name: 'Jim',
  image: 'https://thumbs.dreamstime.com/z/white-blood-cell-happy-face-illustration-63092903.jpg'
}, {
  name: 'Ben',
  image: 'https://st2.depositphotos.com/1007989/5894/i/950/depositphotos_58947501-stock-photo-white-blood-cell-mascot.jpg'
}, {
  name: 'Star',
  image: 'https://image.shutterstock.com/image-vector/white-blood-cell-mascotmascot-illustration-260nw-205804351.jpg'
}]

const id = () => Math.round(Math.random() * (authors.length - 1)) + 1

const messages = [
  { authorId: id(), content: 'I like white blood cells', channelId: 1 },
  { authorId: id(), content: 'I like red blood cells', channelId: 1 },
  { authorId: id(), content: 'I like biology', channelId: 1 },
  { authorId: id(), content: 'I like shooting antibodies', channelId: 2 },
  { authorId: id(), content: 'I like killing diseases!', channelId: 2 },
  { authorId: id(), content: 'Woo hoo!!!', channelId: 2 },
]

const seed = () =>
  Promise.all(authors.map(author =>
    Author.create(author))
  )
  .then(() =>
  Promise.all(channels.map(channel =>
    Channel.create(channel))
  ))
  .then(() =>
  Promise.all(messages.map(message =>
    Message.create(message))
  )
)

const main = () => {
  console.log('Syncing db...')
  db.sync({ force: true })
    .then(() => {
      console.log('Seeding databse...')
      return seed()
    })
    .catch(err => {
      console.log('Error while seeding')
      console.log(err.stack)
    })
    .then(() => {
      db.close()
      return null
    })
}

main()