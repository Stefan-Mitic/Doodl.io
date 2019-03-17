# doodl.io REST API Documentation

## User API

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
  - body: User has not been authenticated

```bash
curl -X GET http://localhost:3000/signout/
```

## Friends API

### Friend Request

### Friend Management

- description: get a paginated list of friends from user

- description: unfriend from user

## Game Image API

## Canvas Drawing Image API

## Image Comparision API

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
