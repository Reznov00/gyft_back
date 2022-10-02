const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.route('/:email/:password').get(getUser);

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .put(updateUser)
  .delete(deleteUser);


module.exports = router;