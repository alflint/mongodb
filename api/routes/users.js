const express = require('express');
const router = express.Router();

const User = require('../../db/models/User');
const Thought = require('../../db/models/Thought');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .populate('thoughts')
            .populate('friends');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET a single user by its _id and populate thought and friend data
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT update user by id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE a user and their corresponding thoughts
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Thought.deleteMany({ username: deletedUser.username });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Check if both users exist
        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);
        if (!user || !friend) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add friendId to userId's friends array
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }

        // Add userId to friendId's friends array
        if (!friend.friends.includes(userId)) {
            friend.friends.push(userId);
            await friend.save();
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Check if both users exist
        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);
        if (!user || !friend) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove friendId from userId's friends array
        user.friends = user.friends.filter(friend => friend.toString() !== friendId);
        await user.save();

        // Remove userId from friendId's friends array
        friend.friends = friend.friends.filter(user => user.toString() !== userId);
        await friend.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Export the router
module.exports = router;
