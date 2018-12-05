#Cytofight

A role playing game where players use white blood cells and infected cells to defeat their opponents. The game is inspired by the immune system and attempts to strike a balance between accurately educating the player on an immune response to foriegn pathogens and fun gameplay. We use Phaser 3.0, Matter.js, and Socket.io as the main technologies for delivering this experience.

In this game, you can either play as a memory B-cell on the blue team or an influenza virion on red team. Playing as a memory B-cell involves a search and destroy strategic play, where the goal is to discover the presence of virions and destroy them by firing antibodies. Virions do not take damage from the antibodies until a matching antigen on the target is found. This is represented visually by changing colors of antibody projectiles being fired until the "secret color" variable is discovered, where the matching antibody then becomes selected and red team begins to take damage. While playing as a virion, the game is played in a King-of-the-Hill format. Virions need to infect epithelial cells distributed throughout the game. Infection takes place by staying within a certain distance of the epithelial cell for 3 seconds and the infection process is represented by a percentile conversion of tinting. Once an epithelial cell turns completely red, it begins to to generate virions. Blue team must destroy all virions and infected epithelial cells before all epithelial cells have been converted into virion factories.

Mast cells and T-cells are also present and have a role in the gameplay. T-cells are initially inactive and pose no threat to red team until they come in contact with histamine particles being secreted by mast cells. Upon activation, t-cells can follow and damage virions that are within a certain radius. Red blood cells are also present in the game, but have no role in the gameplay.

Some additional features we'd like to implement include:
 - Epithelial cell-generated virions can also infect other epithelial cells
 - Activated T-cells can also damange epithelial cells
 - Add single-player functionality
 - Create additional viral teams with differing infection mechanisms
 - Create additional cell types including macrophages and basophiles

Website: https://cyto-fight.herokuapp.com/

Presentation at Fullstack Academy of Code: https://www.youtube.com/watch?list=PLx0iOsdUOUmmMdgcWgABSEBRkSWAG3aNP&v=37uTizBLHDs
<iframe width="560" height="315" src="https://www.youtube.com/embed/37uTizBLHDs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
