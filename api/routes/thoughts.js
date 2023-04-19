const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const User = require('../../db/models/User');
const Thought = require('../../db/models/Thought');

// GET all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find().populate('reactions').populate('username');
        res.json(thoughts);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET a single thought by ID
router.get('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id).populate('reactions').populate('username');
        if (!thought) {
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// POST a new thought
router.post('/', async (req, res) => {
    try {
      const { username, thoughtText } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
      }

      const thought = new Thought({ username, thoughtText });
      await thought.save();

      user.thoughts.push(thought);
      await user.save();

      res.status(201).json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// PUT to update a thought by ID
router.put('/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE a thought by ID
router.delete('/:id', async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found!' });
      }

      const username = thought.username;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      user.thoughts.pull(thought);
      await user.save();

      await thought.remove();

      res.json({ message: 'Thought deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// POST a reaction to a thought
router.post('/:id/reactions', async (req, res) => {
    try {
        const reaction = { ...req.body };
        const thought = await Thought.findByIdAndUpdate(req.params.id, { $push: { reactions: reaction } }, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE a reaction from a thought
router.delete('/:id/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }

        // Find the index of the reaction with the specified reactionId
        const reactionIndex = thought.reactions.findIndex(
            (reaction) => reaction._id.equals(new mongoose.Types.ObjectId(req.params.reactionId))
          );

        // If the reaction doesn't exist, return a 404 status code
        if (reactionIndex === -1) {
            res.status(404).json({ message: 'Reaction not found!' });
            return;
        }

        // Remove the reaction from the reactions array
        thought.reactions.splice(reactionIndex, 1);

        // Save the updated thought
        await thought.save();

        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
