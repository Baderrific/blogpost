# Inkling - Client

Vue 3 front end for the MEVN blog application.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`
3. Start the server (`../server`), then run `npm run dev`

## Pages

- `/posts` - all posts (everyone)
- `/posts/:postId` - one post (everyone). The author can edit it. The author and the admin can delete it
- `/write` - write a post (logged in)
- `/posts/:postId/edit` - edit your own post
- `/my-posts` - your posts with edit and delete
- `/register`, `/login`, `/logout`
