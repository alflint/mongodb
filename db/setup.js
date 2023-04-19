require('dotenv').config()

const mongoose = require('mongoose');
const User = require('./models/User');
const Thought = require('./models/Thought');

// Define the database connection string
const connectionString = process.env.MONGODB_CONN_STR;

// Connect to the database
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Truncate the User collection
async function truncateUsers() {
  try {
    await User.deleteMany();
  } catch (err) {
    console.error(err);
  }
}

// Truncate the Thought collection
async function truncateThoughts() {
  try {
    await Thought.deleteMany();
  } catch (err) {
    console.error(err);
  }
}

async function seed() {
  const users = [
    { username: 'alice', email: 'alice@aol.com' },
    { username: 'bob', email: 'bob@gmail.com' },
    { username: 'charlie', email: 'charlie@yahoo.com' },
    { username: 'dave', email: 'dave@outlook.com' },
  ];

  const thoughts = [
    { thoughtText: 'Hello world!', username: 'alice' },
    { thoughtText: 'This is a test.', username: 'bob' },
    { thoughtText: 'I love MongoDB!', username: 'charlie' },
    { thoughtText: 'Mongoose is awesome!', username: 'dave' },
    { thoughtText: 'I really enjoy using MonogoDB' , username: 'dave' },
    { thoughtText: 'How do you make the most of NodeJS?', username: 'charlie' },
  ];

  try {
    // Create all the users first
    const createdUsers = await User.create(users);

    const createdThoughts = [];

    // Loop through the thoughts array
    for (const thought of thoughts) {

      // Find the corresponding user document
      const user = createdUsers.find(user => user.username === thought.username);

      // Create the thought document
      const createdThought = await Thought.create(thought);

      // Add the created thought to the array
      createdThoughts.push(createdThought);

      // Add the thought's _id to the user's thoughts array
      user.thoughts.push(createdThought._id);

      // Save the updated user document
      await user.save();
    }
  } catch (err) {
    console.error(err);
  }
}

async function start_mongo() {
  try {
    await truncateUsers();
    await truncateThoughts();
    await seed();
  } catch (err) {
    console.error(err);
  }
}



module.exports = {
  start_mongo
};
