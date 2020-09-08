# doodl.io REST API Documentation

## User API

- description: get a paginated list of users
- request: `GET /api/users/[?page=0]`
  - content-type: `application/json`
  - query:
    - page: pagination value (default 0)
- response: 200
  - content-type: `application/json`
  - body: list of usernames (string)

- description: get user info by username
- request: `GET /api/users/:username`
  - content-type: `application/json`
  - body: object
    - username: username
- response: 200
  - content-type: `application/json`
  - body: object
    - _id: username
    - name: display name
    - email: registered email
    - games: number of games played
    - wins: number of games won
    - score: total score earned
- response: 404
  - body: username :username does not exist

### Authorization

- description: sign-up a new user for doodl.io
- request: `POST /signup/`
  - content-type: `application/json`
  - body: object
    - username: username
    - password: password
- response: 200
  - body: user signed up
- response: 401
  - body: access denied
- response: 403
  - body: user is already signed in
- response: 409
  - body: username already exists

```bash
curl -X POST
     -H "Content-Type: `application/json`"
     -d '{"username": "alice", "password": "pass4alice"}'
     http://localhost:3000/signup/
```

- description: sign-in to doodl.io
- request: `POST /signin/`
  - content-type: `application/json`
  - body: object
    - username: username
    - password: password
- response: 200
  - body: user signed in
- response: 401
  - body: access denied
- response: 403
  - body: user is already signed in

```bash
curl -X POST
     -H "Content-Type: `application/json`"
     -d '{"username": "alice", "password": "pass4alice"}'
     http://localhost:3000/signin/
```

- description: sign-out of doodl.io
- request: `GET /signout/`
- response: 200
  - body: user signed out
- response: 401
  - body: access denied
- response: 403
  - body: user has not been authenticated

```bash
curl -X GET http://localhost:3000/signout/
```

### Profile Management

- description: update display name
- request: `PATCH /api/users/name/`
  - content-type: `application/json`
  - body: object
    - name: new display name
- response: 200
  - body: display name has been successfully updated
- response: 400
  - body: display name is not valid
- response: 401
  - body: user has not been authenticated

- description: update password
- request: `PATCH /api/users/password/`
  - content-type: `application/json`
  - body: object
    - oldPassword: current password
    - newPassword: new password
- response: 200
  - body: password has been successfully updated
- response: 400
  - body: password is not valid
- response: 401
  - body: user has not been authenticated

## Friends API

### Friend Request

- description: send a friend request to a user
- request: `POST /api/users/friend/[?target]`
  - content-type: `application/json`
  - query:
    - target: username to friend
- response: 200
  - content-type: `application/json`
  - body: object
    - requester: sender of friend request
    - recipient: receiver of friend request
    - createdAt: time of when friend request was sent
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: target user does not exist

- description: accept a friend request from a user
- request: `POST /api/users/acceptrequest/[?target]`
  - content-type: `application/json`
  - query:
    - target: username to accept request from
- response: 200
  - body: user is now friends
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: friend request does not exist

- description: reject a friend request from a user
- request: `POST /api/users/rejectrequest/[?target]`
  - content-type: `application/json`
  - query:
    - target: username to reject request from
- response: 200
  - body: user has rejected request
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: friend request does not exist

- description: get a list of all sent friend requests
- request: `GET /api/users/:username/sentrequests/[?page=0]`
  - content-type: `application/json`
  - params:
    - username: username of authenticated user
  - query:
    - page: pagination value
- response: 200
  - content-type: `application/json`
  - body: list of object
    - requester: sender of friend request
    - recipient: receiver of friend request
    - createdAt: time of when friend request was sent
- response: 401
  - body: user has not been authenticated

- description: get a list of all received friend requests
- request: `GET /api/users/:username/recievedrequests/[?page=0]`
  - content-type: `application/json`
  - params:
    - username: username of authenticated user
  - query:
    - page: pagination value
- response: 200
  - body: list of object
    - requester: sender of friend request
    - recipient: receiver of friend request
    - createdAt: time of when friend request was sent
- response: 401
  - body: user has not been authenticated

### Friend Management

- description: get a paginated list of friends from user
- request: `GET /api/users/:username/friends/`
  - content-type: `application/json`
  - params:
    - username: username
- response: 200
  - content-type: `application/json`
  - body: list of friends' usernames (string)
- response: 404
  - body: user :username does not exist

- description: unfriend from user
- request: `POST /api/users/unfriend/[?target]`
  - content-type: `application/json`
  - query:
    - target: username to unfriend from
- response: 200
  - body: user ended friendship
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: target user does not exist
- response: 404
  - body: target user is not a friend

## Game Image API

- description: get game image metadata
- request: `GET /api/game/images/`
  - content-type: `application/json`
  - body: object
    - id: image id
- response: 200
  - content-type: `application/json`
  - body: object
    - _id: image id
    - isTrace: whether or not image is a trace file
    - file: image metadata
- response: 404
  - body: image id :id does not exist

- description: get game image png file
- request: `GET /api/game/images/file/`
  - content-type: `application/json`
  - body: object
    - id: image id
- response: 404
  - body: image id :id does not exist

## Canvas Drawing Image API

- description: post a drawing to the game
- request: `POST /api/drawing/`
  - content-type: `application/json`
  - body: object
    - imageId: id of image that the drawing is based on
    - gameId: id of game that the drawing is from
    - dataURL: image data URL encoded in base64
- response: 401
  - body: user has not been authenticated

- description: get drawing image metadata
- request: `GET /api/drawing/:id/`
  - content-type: `application/json`
  - params:
    - id: drawing id
- response: 200
  - content-type: `application/json`
  - body: object
    - _id: drawing id
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: drawing id :id does not exist

- description: get drawing image png file
- request: `GET /api/drawing/:id/file/`
  - content-type: `application/json`
  - params:
    - id: drawing id
- response: 200
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: drawing id :id does not exist

- description: delete drawing image from server
- request: `DELETE /api/drawing/:id/`
  - content-type: `application/json`
  - params:
    - id: drawing id
- response: 200
- response: 401
  - body: user has not been authenticated
- response: 404
  - body: drawing id :id does not exist

## Image Comparison API

- description: compare an image and drawing and get the difference in pixels
- request: `POST /api/game/images/:id/compare/`
  - content-type: `application/json`
  - params:
    - id: image id
  - body: object
    - drawingId: id of drawing image
- response: 200
  - content-type: `application/json`
  - body: object
    - imageId: game image
    - drawingId: drawing image
    - difference: difference in pixels
    - score: score calculated
- response: 404
  - body: image id :id does not exist
- response: 404
  - body: drawing id :id does not exist

## Leaderboard and Scoring API

- description: get top 10 players in leaderboard
- request: `GET /api/leaderboard/`
- response: 200
  - content-type: `application/json`
  - body: list of object
    - _id: username of player
    - score: player's total score

- description: get current player's position in leaderboard
- request: `GET /api/leaderboard/me/`
- response: 200
  - content-type: `application/json`
  - body: object
    - player: username of player
    - score: player's total score
    - position: player's position on the leaderboard
- response: 401
  - body: user has not been authenticated

- description: get player's game history
- request: `GET /api/leaderboard/history/`
- response: 200
  - content-type: `application/json`
  - body: list of object
    - gameId: id of game played
    - player: username of player
    - score: player's score for the game
    - createdAt: time of when game was played
- response: 401
  - body: user has not been authenticated

- description: update player's total number of wins
- request: `PATCH /api/leaderboard/:username/`
  - content-type: `application/json`
  - params:
    - username: username of player
- response: 200
  - content-type: `application/json`
  - body: object
    - _id: username of player
    - wins: player's new win count
    - updatedAt: time of when wins was updated
- response: 404
  - body: username :username does not exist

- description: add to player score
- request `POST /api/leaderboard/:gameId/:username/`
  - content-type: `application/json`
  - params:
    - gameId: id of game
    - username: username
- response: 200
  - content-type: `application/json`
  - body: object
    - player: username of player
    - score: player's new total score
    - position: player's new position on the leaderboard
- response: 404
  - body: username :username does not exist

- description: get player score of specified game
- request `GET /api/leaderboard/:gameId/:username/`
  - content-type: `application/json`
  - params:
    - gameId: id of game
    - username: username
- response: 200
  - content-type: `application/json`
  - body: list of object
    - gameId: id of game played
    - player: username of player
    - score: player's score for the game
    - createdAt: time of when game was played
- response: 404
  - body: username :username does not exist
