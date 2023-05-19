const router = require('express').Router();
const {
  getUsers,
  // getOneUser,
  createUser,
  // updateUser,
  // deleteUser,
  // addFriend,
  // RemoveFriend
} = require('../../controllers/userController.js');

// /api/courses
router.route('/').get(getUsers).post(createUser);

// /api/courses/:courseId
// router
//   .route('/:courseId')
//   .get(getSingleCourse)
//   .put(updateCourse)
//   .delete(deleteCourse);

module.exports = router;
