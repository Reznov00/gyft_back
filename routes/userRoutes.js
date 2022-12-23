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

router.route('/users/:email/:password').get(getUser);

router.route('/users/').get(getUsers).post(createUser);
router.route('/volunteers').get(getVolunteers);
router.route('/volunteers/approve/:id').patch(approveVolunteer);
router.route('/users/verify').post(verifyUser);

router.route('/users/:user/add').put(addInterestingItem);
router.route('/users/:user/remove').put(deleteInterestingItem);
router.route('/users/:id/requests').post(getRequests);

router.route('/users/apply/:id').patch(applyAsVolunteer);
// router.route('/applied/:id').post(changeApplicationStatus);

router
  .route('/users/:id')
  .get(getLoggedUser)
  .put(updateUser)
  .delete(deleteUser);
router.route('/users/change/:id').put(changePassword);

module.exports = router;
