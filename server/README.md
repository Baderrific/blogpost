# MEVN Blog Application - Server

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your values
3. `npm run dev` (or `npm start`)

## Making the first admin

Registration always creates a regular user. To create the first admin, set `isAdmin: true`
on a user directly in MongoDB. After that, an admin can promote others with
`PATCH /users/:id/set-as-admin`.

## Endpoints

Protected routes need the header `Authorization: Bearer <access token>`.

### Users `/users`

| Method | Route               | Access | Description                              |
| ------ | ------------------- | ------ | ---------------------------------------- |
| POST   | /register           | Public | Body: `username`, `email`, `password`    |
| POST   | /login              | Public | Body: `email`, `password`. Returns `access` token |
| GET    | /details            | User   | Logged in user's details                 |
| PATCH  | /:id/set-as-admin   | Admin  | Promote a user to admin                  |

### Posts `/posts`

| Method | Route       | Access        | Description                              |
| ------ | ----------- | ------------- | ---------------------------------------- |
| POST   | /           | User          | Body: `title`, `content`                 |
| GET    | /           | Public        | All posts, newest first                  |
| GET    | /my-posts   | User          | Posts written by the logged in user      |
| GET    | /:id        | Public        | Single post                              |
| PUT    | /:id        | Author only   | Body: `title` and/or `content`           |
| DELETE | /:id        | Author or Admin | Delete a post                          |

## Error format

Validation and server errors go through `errorHandler` in `auth.js`:

```json
{ "error": { "message": "Validation failed", "errorCode": "VALIDATION_ERROR", "details": ["Title is Required"] } }
```

Controller level checks (bad input, not found, forbidden) respond with `{ "message": "..." }`
and the matching status code (400, 401, 403, 404, 409).
