const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  addInterestedUser,
  getItemsPostedByUser,
  getRequests,
  addApprovedUser,
  deleteInterestedUser,
} = require('../controllers/itemController');

const router = express.Router({ mergeParams: true });

router.route('/posted/:user').get(getItemsPostedByUser);
router.route('/:id/requests').get(getRequests);
router.route('/:user/:lat/:lon/:distance/:category').get(getItems);

router.route('/:id/add').put(addInterestedUser);
router.route('/:id/remove').put(deleteInterestedUser);
router.route('/:id/approve').put(addApprovedUser);

router.route('/').post(createItem);

router.route('/:id').get(getItem).patch(updateItem).delete(deleteItem);

module.exports = router;
