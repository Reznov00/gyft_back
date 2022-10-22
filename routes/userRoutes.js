const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addInterestingItem,
  deleteInterestingItem,
} = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.route('/:email/:password').get(getUser);

router.route('/').get(getUsers).post(createUser);

router.route('/:user/add').put(addInterestingItem);
router.route('/:user/remove').put(deleteInterestingItem);

router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
