const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try { 
      const userBytes = await User.find();
      res.json(userBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a user
  async getOneUser(req, res) {
    try {
      const userBytes = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!userBytes) {
        return res.status(404).json({ message: 'No course with that ID' });
      }

      res.json(userBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a user
  async createUser(req, res) {
    try {
      const userBytes = await User.create(req.body);
      res.json(userBytes);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a User
  async deleteUser(req, res) {
    try {
      const userBytes = await User.findOneAndDelete({ _id: req.params.userId });

      if (!userBytes) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: userBytes.thoughts } });
      res.json({ message: 'Users and students deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a course
  async updateUser(req, res) {
    try {
      const userBytes = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userBytes) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(userBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
//add friend 
  async addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);

    try {
      const userBytes = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userBytes) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(userBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeFriend(req, res) {
    try {
      const userBytes = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!userBytes) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(userBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};


