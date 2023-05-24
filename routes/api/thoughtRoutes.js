const router = require('express').Router();
const {
    acquireThoughts, onlyOneThought, createThought,
    updateThought, deleteThought, addReaction,
    removeReaction,
} = require('../../controllers/thoughtController');

// /api/students
router.route('/').get(acquireThoughts).post(createThought);

// /api/students/:studentId
router.route('/:thoughtId').get(onlyOneThought).delete(deleteThought);

// /api/students/:studentId/assignments
router.route('/:thoughtId/reactions').post(addReaction);

// /api/students/:studentId/assignments/:assignmentId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;