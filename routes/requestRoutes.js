const express = require('express');
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  getRequestsPostedByUser,
} = require('../controllers/requestController');

const router = express.Router({ mergeParams: true });

router.route('/:user/:lat/:lon/:distance').get(getRequests);

router.route('/:user').get(getRequestsPostedByUser);

router.route('/').post(createRequest);

router.route('/:id').get(getRequest).put(updateRequest).delete(deleteRequest);

module.exports = router;
