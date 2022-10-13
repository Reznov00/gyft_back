const express = require('express');
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
} = require('../controllers/requestController');

const router = express.Router({ mergeParams: true });

router.route('/:lat/:lon/:distance').get(getRequests);

router.route('/').post(createRequest);

router.route('/:id').get(getRequest).put(updateRequest).delete(deleteRequest);

module.exports = router;
