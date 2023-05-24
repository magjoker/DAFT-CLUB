const router = require('express').Router();
const {
  getUsers, getOneUser, createUser,
  updateUser, deleteUser, addFriend,
  removeFriend
} = require('../../controllers/userController.js');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router
  .route('/:userId')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

//api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend)

module.exports = router;
