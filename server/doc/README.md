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

- description: accept a friend request from a user

- description: reject a friend request from a user

- description: get a list of all sent friend requests

- description: get a list of all received friend requests

### Friend Management

- description: get a paginated list of friends from user
- request: `GET /api/users/:username/friends/`

- description: unfriend from user
- request: `POST /api/users/unfriend/`

## Game Image API

- description: get game image metadata

- description: get game image png file

## Canvas Drawing Image API

- description: post a drawing to the game

- description: get drawing image metadata

- description: get drawing image png file

- description: delete drawing image from server

## Image Comparison API

- description: compare an image and drawing and get the difference in pixels
- request: `POST /api/game/images/:id/compare/`
  - content-type: `application/json`
  - body: object
    - drawingId: ID of drawing image
- response: 200
  - body: object
    - image1: game image
    - image2: drawing image
    - difference: difference in pixels

## Leaderboard and Scoring API

- description: get top 10 players in leaderboard

- description: get current player's position in leaderboard

- description: get player's game history

- description: update player's position on the leaderboard
