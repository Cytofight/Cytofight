import React, {Component} from 'react'

const helperTCell = {
  id: 1,
  name: 'Helper T Cells (The Generals)',
  blurb:
    'Every army needs a commander. Enter the helper T cell. When an enemy shows up, old or new, the helper T springs into action and figures out what the rest of the troops need to know to fight off the new attacker. Once a helper T identifies an enemy, it recruits other cells in the immune system to attack the weaknesses of the invader, just like a general commands different kinds of troops to attack different parts of an invading army. Pathogens beware: once you catch the attention of one of these noble warriors, the fight is on!',
  img:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Blausen_0625_Lymphocyte_T_cell_%28crop%29.png/220px-Blausen_0625_Lymphocyte_T_cell_%28crop%29.png'
}

const macrophage = {
  id: 2,
  name: 'Macrophages (The Infantry)',
  blurb:
    'Macrophages are the general doomsday bringers for would be invaders. When a new pathogen enters your body, macrophages find and literally eat the invaders whole! Macrophages are the biggest cell in the immune system--enemies would be wise to avoid these brutes',
  img:
    'http://cancerdiscovery.aacrjournals.org/content/candisc/4/7/756.2/F1.medium.gif'
}
const killerTCell = {
  id: 3,
  name: 'Killer T Cells (Special Forces)',
  blurb:
    'Nothing should strike more fear into the heart of an enemy than an army of rabid Killer Ts. When a Helper T (our general) identifies an invader, it gives a diagram of that invader to the Killer T cells. The Killer T uses this map to find those particular enemies, locks onto an "antigen" (think of it like a lock on the ouside of the an enemy cell), and quite literally rips the enemy apart! Killer Ts are fearless warriors and are one of the most specialized weapons your body has. Use these elite units wisely!',
  img:
    'https://3.bp.blogspot.com/-vCfQRdV2MY0/Uqh3XF8CVhI/AAAAAAAAGiM/tRwxE6srQ5I_PWPCFEf-LsYSKU9jdnSQQCPcB/s1600/natural-killer-cell_bryans.jpg'
}

const bCell = {
  id: 4,
  name: 'B Cells (The Archers)',
  blurb:
    'No army would be complete without a bit of range. Enter the B Cell. B Cells are capable of memorizing the antigens on the outside of enemy cells and then producing "antibodies", which act like little keys that fit into those enemy antigens and turn to break apart the enemy cells. Some B cells can live up to ten years! Once a B Cell recognizes an enemy and starts pumping antibodies, the body gains a serious leg up in the war against invaders!',
  img:
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Blausen_0624_Lymphocyte_B_cell_%28crop%29.png'
}

const antiBody = {
  id: 5,
  name: 'Antibodies (The Missiles)',
  blurb:
    "While antibodies are not technically cells, they play an incredibly important role in your body's fight against the dark forces that want to cause it harm. An antibody is like a tiny key that finds a particular lock on the outside of an enemy cell. Once an antibody locks into the cell, it 'turns,' causing the enemy cell to be torn apart. Enemies best beware: these antibodies may be tiny, but they are as lethal a weapon as any!",
  img:
    'https://www.roche.com/dam/jcr:42b93f69-aed3-4bbd-b796-99d15cc95a90/en/crossmab-1920.jpg'
}

const heroes = [helperTCell, macrophage, killerTCell, bCell, antiBody]

export default class Heroes extends Component {
  render() {
    return (
      <div id="characterPage">
        <h1>The Heroes</h1>
        {heroes.map(hero => {
          return (
            <div key={hero.id} className="hero">
              <h3>{hero.name}</h3>
              <img src={hero.img} width="200px" />
              <p>{hero.blurb}</p>
            </div>
          )
        })}
      </div>
    )
  }
}
