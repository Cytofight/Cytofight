'use strict'

const db = require('../server/db')
const {User, Character} = require('../server/db/models/index')

const heroes = [
  {
    name: 'Helper T Cells (The Generals)',
    category: 'hero',
    blurb:
      'Every army needs a commander. Enter the helper T cell. When an enemy shows up, old or new, the helper T springs into action and figures out what the rest of the troops need to know to fight off the new attacker. Once a helper T identifies an enemy, it recruits other cells in the immune system to attack the weaknesses of the invader, just like a general commands different kinds of troops to attack different parts of an invading army. Pathogens beware: once you catch the attention of one of these noble warriors, the fight is on!',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Blausen_0625_Lymphocyte_T_cell_%28crop%29.png/220px-Blausen_0625_Lymphocyte_T_cell_%28crop%29.png'
  },

  {
    name: 'Macrophages (The Infantry)',
    category: 'hero',
    blurb:
      'Macrophages are the general doomsday bringers for would be invaders. When a new pathogen enters your body, macrophages find and literally eat the invaders whole! Macrophages are the biggest cell in the immune system--enemies would be wise to avoid these brutes',
    img:
      'http://cancerdiscovery.aacrjournals.org/content/candisc/4/7/756.2/F1.medium.gif'
  },
  {
    name: 'Killer T Cells (Special Forces)',
    category: 'hero',
    blurb:
      'Nothing should strike more fear into the heart of an enemy than an army of rabid Killer Ts. When a Helper T (our general) identifies an invader, it gives a diagram of that invader to the Killer T cells. The Killer T uses this map to find those particular enemies, locks onto an "antigen" (think of it like a lock on the ouside of the an enemy cell), and quite literally rips the enemy apart! Killer Ts are fearless warriors and are one of the most specialized weapons your body has. Use these elite units wisely!',
    img:
      'https://3.bp.blogspot.com/-vCfQRdV2MY0/Uqh3XF8CVhI/AAAAAAAAGiM/tRwxE6srQ5I_PWPCFEf-LsYSKU9jdnSQQCPcB/s1600/natural-killer-cell_bryans.jpg'
  },

  {
    name: 'B Cells (The Archers)',
    category: 'hero',
    blurb:
      'No army would be complete without a bit of range. Enter the B Cell. B Cells are capable of memorizing the antigens on the outside of enemy cells and then producing "antibodies", which act like little keys that fit into those enemy antigens and turn to break apart the enemy cells. Some B cells can live up to ten years! Once a B Cell recognizes an enemy and starts pumping antibodies, the body gains a serious leg up in the war against invaders!',
    img:
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Blausen_0624_Lymphocyte_B_cell_%28crop%29.png'
  },

  {
    name: 'Antibodies (The Missiles)',
    category: 'hero',
    blurb:
      "While antibodies are not technically cells, they play an incredibly important role in your body's fight against the dark forces that want to cause it harm. An antibody is like a tiny key that finds a particular lock on the outside of an enemy cell. Once an antibody locks into the cell, it 'turns,' causing the enemy cell to be torn apart. Enemies best beware: these antibodies may be tiny, but they are as lethal a weapon as any!",
    img:
      'https://www.roche.com/dam/jcr:42b93f69-aed3-4bbd-b796-99d15cc95a90/en/crossmab-1920.jpg'
  }
]

const villains = [
  {
    name: 'Influenza C (The Hoard)',
    category: 'villain',
    blurb:
      "Something doesn't need to be big to cause big problems. This little monster is influenza c, a virus. Viruses work by 'hijacking' your cells and turning them into zombies that make more viruses--scary! If too many of these little guys invade your system, they make you feel all the symptoms you know as the flu, which could give you a fever, upset stomach, chills, and a nasty cough. Get your flu shot!",
    img:
      'https://www.21stcentech.com/wp-content/uploads/2012/02/influenza-virus.jpg'
  }
]

// seed your database here!

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  await Promise.all(
    // [
    //   Character.create({
    //     name: 'Helper T Cells (The Generals)',
    //     category: 'hero',
    //     blurb:
    //       'Every army needs a commander. Enter the helper T cell. When an enemy shows up, old or new, the helper T springs into action and figures out what the rest of the troops need to know to fight off the new attacker. Once a helper T identifies an enemy, it recruits other cells in the immune system to attack the weaknesses of the invader, just like a general commands different kinds of troops to attack different parts of an invading army. Pathogens beware: once you catch the attention of one of these noble warriors, the fight is on!',
    //     img:
    //       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Blausen_0625_Lymphocyte_T_cell_%28crop%29.png/220px-Blausen_0625_Lymphocyte_T_cell_%28crop%29.png'
    //   })
    // ]
    heroes.map(hero => {
      Character.create(hero)
    })
  )

  await Promise.all(
    villains.map(villain => {
      Character.create(villain)
    })
  )
  // )
  // const villainDB = await Promise.all(
  //   villains.map(villain => {
  //     Character.create(villain)
  //   })
  // )

  console.log(`seeded ${users.length} users and heroes`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
  // finally {
  //   console.log('closing db connection')
  //   await db.close()
  //   console.log('db connection closed')
  // }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
