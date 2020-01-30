# Super Tic Toe

A HTML/CSS/JS with JQuery powered web application to play a modified variant of Tic Tac Toe.

## Running the application

Open `index.html` in a modern browser. The site is currently deployed to [netlify](supertictactoe.netlify.com).

## Rules

Rules are originally made by [mmaxon](https://github.com/mmaxon) and [khpolivanov](https://github.com/khpolivanov).

In a game of Tic Tac Toe, a player wins by getting three of their X’s (or O’s) in a row or diagonal in the 9 spaces provided on the game board. The two players take turns until one of them wins or the game is a tie since there is no possible win. In Super Tic Tac Toe (STTT), the principal is the same, but there are more spaces and therefore more rules.

### The Board

A STTT board is a 3x3 board where each space contains another 3x3 board. There are 9 “super spaces” that form the larger 3x3 board. In total, there are 81 spaces where a ‘🔴’ or ‘🔵’ can go.

![A blank Super Tic Tac Toe Board](/assets/board.PNG)

### Taking Turns

The player who is placing 🔴’s shall go first. Turns should alternate between this first player and the other player. The first player can choose any space in the central “super space” The other player should locate the “super space” that correlates to the first player’s space on the board. Subsequent turns should follow this pattern: locate the “super space” that correlates to the previous player’s played space and place an ‘🔴’/’🔵’ in one of the playable space.

### Example Turns

![Player 🔴 plays the upper left space in the central super space. Player 🔵 should play in the upper left super space](/assets/turn1.PNG)

![Player 🔵 plays the lower middle space in the upper left super space. Player 🔴 should play the lower middle super space](/assets/turn2.PNG)

![Player 🔴 plays the lower middle space in the lower middle super space. Player 🔵 should play in the lower middle super space](/assets/turn3.PNG)

It is possible to remain the super space for two turns, as shown in the third turn. As the game progresses, it will be possible for a player to win a super space by getting three in a row or diagonal.

Once a player has won a super space, the super space is taken out of play. There is a special condition in which the blank spaces in a won super space can be taken advantage of. When a player plays in a space that leads to a won super space, the other player looks at the blank spots and can choose to go to the correlated super spaces.

Below, Player 🔴 places their piece int he central space of the central super space and gets three 🔴's in a diagonal. Player 🔵 can now play in any super space corresponding to the empty spaces in the middle super space.

![Picture of the scenario where player 🔴 wins a super space and player 🔵 can now play in any super space corresponding to the empty spaces in the middle super space](/assets/turn4.PNG)

### Winning a Game

A player wins the game outright if they get three super spaces in a row or diagonal. If the game is unwinnable outright for both players, the number of super spaces won by each player is compared.
