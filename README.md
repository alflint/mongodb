# MongoDB Demo - Social Network API

## Description

This repository contains a basic demo of using MongoDB with Node.js and Express. It includes routes for creating, reading, updating, and deleting users and their thoughts.

[Video Walkthrough](https://drive.google.com/file/d/1BA97FnZr350AQE8nTjVLfJHb_WDGNtJ_/view?usp=sharing)


<hr>

## Table of Contents

[Getting Started](#Getting_Started)

[Routes](#Routes)

[Questions](#Questions)

<hr>

## Getting Started

To get started with this project, first clone the repository and install the dependencies:

```
git clone https://github.com/alflint/mongodb.git
cd mongodb
npm install
```

Next, create a `.env` file in the root directory of the project and add your MongoDB connection string:

```
MONGODB_URI=<your-mongodb-uri>
```


Finally, start the server:

```
npm start
```


The server should now be running at `http://localhost:3000`.

## Routes

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user by ID
- `DELETE /api/users/:id` - Delete a user by ID

### Friends
- `POST api/users/:userId/friends/:friendId` - Create a new friendship
- `DELETE api/users/:userId/friends/:friendId` - Delete an existing friendship

### Thoughts

- `GET /api/thoughts` - Get all thoughts
- `GET /api/thoughts/:id` - Get a single thought by ID
- `POST /api/thoughts` - Create a new thought
- `PUT /api/thoughts/:id` - Update a thought by ID
- `DELETE /api/thoughts/:id` - Delete a thought by ID

### Reactions
- `POST /api/thoughts/:thoughtId/reactions` - Add a reaction to a thought
- `DELETE /api/thoughts/:id/reactions/:reactionId` - Delete a reaction from a thought by ID

## Questions

If you have any questions feel free to [email me](mailto:alexandreaflint1111@gmail.com) or reach out on [Github](https://github.com/alflint11)

