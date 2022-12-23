const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addInterestingItem,
  deleteInterestingItem,
  getRequests,
  applyAsVolunteer,
  getLoggedUser,
  changeApplicationStatus,
  verifyUser,
  changePassword,
  getVolunteers,
  approveVolunteer,
} = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.route('/:email/:password').get(getUser);

router.route('/').get(getUsers).post(createUser);
router.route('/verify').post(verifyUser);

router.route('/:user/add').put(addInterestingItem);
router.route('/:user/remove').put(deleteInterestingItem);
router.route('/:id/requests').post(getRequests);

router.route('/apply/:id').patch(applyAsVolunteer);
// router.route('/applied/:id').post(changeApplicationStatus);

router.route('/:id').get(getLoggedUser).put(updateUser).delete(deleteUser);
router.route('/change/:id').put(changePassword);

module.exports = router;
