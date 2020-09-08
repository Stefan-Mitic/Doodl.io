# Doodl.io

![Doodl.io Logo](/assets/Doodlio.png)

### Created By <img src="/assets/JAS%20Systems.png" width="120" height="50" title="JAS Logo"> 

1. **Yun Jie (Jeffrey) Li** -- [@privatejfx141](https://github.com/privatejfx141)
2. **Alexei Coreiba** -- [@alexeicoreiba](https://github.com/alexeicoreiba)
3. **Stefan Mitic** -- [@stefan-mitic](https://github.com/Stefan-Mitic)

## Doodl.io Link

The game can be accessed here: [Heroku Link](https://doodlio.herokuapp.com).

## Description

Doodl.io is an online multi-player canvas-based drawing game where players can challenge others with their drawing skills. At the start, players can either create or join existing matches with a unique url that corresponds to each game. After loading into the lobby, the host starts the 5 round game. Each round consists of a random image and an empty canvas to draw on. Players have 30 seconds for each round to come up with the closest drawing to the current predefined image. After the game ends, a winner is decided by choosing the best doodles from each round and tallying up all the points.

## Features

### Key Features

- Option to create a new game where a unique link is generated and can be sent to others to join.
- Lobby that updates real-time as players join a game.
- Game play with multiple rounds set-up and canvas utility.
- Post game results where a winner is chosen by an image recognition api.

### Additional Features

- Chat room in each game for player communication.
- Leaderboard which has the highest scored players.
- Public and private matches with different settings.
- List of multiple games and a search bar so players can choose a public match to join.
- Addition and removal of friends for each user making it easier to invite others.

## Technology

- React.js
- MongoDB
- Node.js
- Express.js
- Socket.io
- Image Recognition APIs (pixelmatch)

## Challenges

1. Image comparison between doodled image and uploaded image.
2. Real-time updates using Socket.io.
3. Peer-to-Peer connection for chat and lobby entry.
4. Search bar for match searching.
5. Database set-up with user authentication.

## Planned Development

### Beta Version

For the beta version of Doodl.io, we plan on completing the main features of the game so that players would be able to play a single round of the game.

We hope to get an image recognition API in place, implement the sockets that allow for multiplayer sessions, and have a MongoDB database set up that stores the user credentials and game states.

### Final Version

For the final version of Doodl.io, we plan on implementing extra features such as a friend system, a lobby chat, leaderboards, and game invitations. If we have time, we may even implement an in-game viewer using WebRTC, where players can view each other attempting to draw the same image.

The final application will be deployed to Heroku, while the database will reside on the servers provided by MongoDB Atlas (formerly mLab).
