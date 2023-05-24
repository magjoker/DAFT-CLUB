const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');


//
module.exports = {
  // Acquires all thoughts
  async acquireThoughts(req, res) {
    try {
      const thoughtBytes = await Thought.find();

      res.json(thoughtBytes);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Gets one thought
  async onlyOneThought(req, res) {
    try {
      const thoughtBytes = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thoughtBytes) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thoughtBytes);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createThought(req, res) {
    try {
      const thoughtBytes = await Thought.create(req.body);
      res.json(thoughtBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Updates a thought
  async updateThought(req, res) {
    try {
      const thoughtBytes = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughtBytes) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thoughtBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a student and remove them from the course
  async deleteThought(req, res) {
    try {
      const thoughtBytes = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thoughtBytes) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      const userBytes = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!userBytes) {
        return res.status(404).json({
          message: 'Thought deleted, but no user found',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);

    try {
      const thoughtBytes = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughtBytes) {
        return res
          .status(404)
          .json({ message: 'No reaction found with that ID :(' });
      }

      res.json(thoughtBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeReaction(req, res) {
    try {
      const thoughtBytes = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thoughtBytes) {
        return res
          .status(404)
          .json({ message: 'No reaction found with that ID :(' });
      }

      res.json(thoughtBytes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
